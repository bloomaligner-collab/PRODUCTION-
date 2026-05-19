-- 20260519120000_chat_media_and_form_prefs.sql
--
-- ADDITIVE / non-destructive. Production already has a single-file
-- chat-media implementation (chat_messages.media_url/media_type/
-- media_name + the chat-media bucket + storage RLS, applied as
-- migration 20260519102522). This migration adds a parallel
-- multi-file mechanism WITHOUT breaking the existing one:
--
--   (1) chat_messages.attachments jsonb — array of
--       { path, kind, mime, name, size }. Files use the same private
--       chat-media bucket; the browser reads them via signed URLs.
--   (2) The body CHECK is widened so a message is valid when it has
--       text OR a legacy media_url OR one+ attachments (so neither
--       the old nor the new mechanism rejects a media-only message).
--   (3) user_form_prefs — per-user, cross-device form customisation
--       (field order / visibility / icon toggle). Owner-only RLS,
--       same pattern as user_views. First consumer: the Customer
--       Feedback "Log Feedback" modal.
--
-- The chat-media bucket and its storage policies already exist with
-- identical definitions; the idempotent guards below simply re-assert
-- them so a fresh environment still gets them.

-- ── 1. chat_messages.attachments ──────────────────────────────────────
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Widen the body CHECK to also accept attachment-only messages.
-- Drops the original 1..4000 check AND the existing media variant,
-- then adds one combined predicate covering text / media_url /
-- attachments so BOTH chat-media mechanisms keep working.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.chat_messages'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%char_length(body)%'
  LOOP
    EXECUTE format('ALTER TABLE public.chat_messages DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.chat_messages
  DROP CONSTRAINT IF EXISTS chat_messages_body_or_attach_chk;
ALTER TABLE public.chat_messages
  ADD CONSTRAINT chat_messages_body_or_attach_chk
  CHECK (
    char_length(body) <= 4000
    AND (
      char_length(btrim(body)) >= 1
      OR media_url IS NOT NULL
      OR jsonb_array_length(attachments) > 0
    )
  );

-- ── 2. Storage bucket + policies (idempotent re-assert) ───────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS chat_media_read   ON storage.objects;
DROP POLICY IF EXISTS chat_media_insert ON storage.objects;
DROP POLICY IF EXISTS chat_media_delete ON storage.objects;

CREATE POLICY chat_media_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'chat-media');

CREATE POLICY chat_media_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat-media');

CREATE POLICY chat_media_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'chat-media'
    AND (owner = auth.uid() OR public.cw_is_manager())
  );

-- ── 3. user_form_prefs ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_form_prefs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  form       TEXT NOT NULL,
  prefs      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, form)
);

CREATE OR REPLACE FUNCTION public.user_form_prefs_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_form_prefs_updated_at ON public.user_form_prefs;
CREATE TRIGGER user_form_prefs_updated_at
  BEFORE UPDATE ON public.user_form_prefs
  FOR EACH ROW EXECUTE FUNCTION public.user_form_prefs_set_updated_at();

ALTER TABLE public.user_form_prefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_form_prefs_own_select ON public.user_form_prefs;
DROP POLICY IF EXISTS user_form_prefs_own_insert ON public.user_form_prefs;
DROP POLICY IF EXISTS user_form_prefs_own_update ON public.user_form_prefs;
DROP POLICY IF EXISTS user_form_prefs_own_delete ON public.user_form_prefs;

CREATE POLICY user_form_prefs_own_select ON public.user_form_prefs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY user_form_prefs_own_insert ON public.user_form_prefs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_form_prefs_own_update ON public.user_form_prefs
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_form_prefs_own_delete ON public.user_form_prefs
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
