-- 20260519120000_chat_media_and_form_prefs.sql
--
-- (1) Chat attachments: photo / video / voice / camera. Messages can
--     now carry files alongside (or instead of) text.
--       • chat_messages.attachments jsonb  — array of
--         { path, kind, mime, name, size }. Files live in a private
--         Storage bucket; the browser fetches them via short-lived
--         signed URLs.
--       • The old "body must be 1..4000 chars" CHECK is relaxed so an
--         attachment-only message (empty body) is allowed.
--       • Storage bucket `chat-media` (private) + RLS: any signed-in
--         user may upload and read; delete is owner-or-manager only.
--
-- (2) user_form_prefs — per-user, cross-device form customisation
--     (field order / visibility / icon toggle). Same owner-only RLS
--     pattern as user_views. First consumer: the Customer Feedback
--     "Log Feedback" modal.

-- ── 1a. chat_messages.attachments ─────────────────────────────────────
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Relax the body length CHECK. The original column-level
-- `CHECK (char_length(body) BETWEEN 1 AND 4000)` is auto-named
-- chat_messages_body_check; drop it (and any equivalent) then add a
-- table check that also accepts an empty body when files are attached.
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
    AND (char_length(btrim(body)) > 0 OR jsonb_array_length(attachments) > 0)
  );

-- ── 1b. Storage bucket + policies ─────────────────────────────────────
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

-- ── 2. user_form_prefs ────────────────────────────────────────────────
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
