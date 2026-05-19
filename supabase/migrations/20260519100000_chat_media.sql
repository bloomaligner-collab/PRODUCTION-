-- 20260519100000_chat_media.sql
--
-- Lets chat messages carry an attachment (photo / video / voice note),
-- captured live from the device camera/mic or picked from the gallery.
--
--   • media_url   storage object path inside the private `chat-media`
--                 bucket (NOT a public URL — the client resolves a
--                 short-lived signed URL at render time).
--   • media_type  'image' | 'video' | 'audio' | 'file'
--   • media_name  original filename, used for the download label.
--
-- A message may now be media-only (empty body): the body CHECK is
-- relaxed to "non-empty text OR an attachment".
--
-- Storage RLS follows the same authenticated = trusted model as the
-- rest of the app (see 20260423162240). The object path is an
-- unguessable per-sender UUID and the row that references it is still
-- gated by the strict chat_messages SELECT policy.

-- ── 1. COLUMNS ────────────────────────────────────────────────────────
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_url  text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_type text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_name text;

-- ── 2. BODY CONSTRAINT — allow media-only messages ────────────────────
-- The original unnamed column CHECK (1..4000) is auto-named
-- chat_messages_body_check by Postgres. Drop it and replace with a
-- named table constraint that also accepts an empty body when an
-- attachment is present.
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_body_check;
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_body_or_media_chk;
ALTER TABLE public.chat_messages
  ADD CONSTRAINT chat_messages_body_or_media_chk
  CHECK (
    char_length(body) <= 4000
    AND (char_length(btrim(body)) >= 1 OR media_url IS NOT NULL)
  );

-- ── 3. PRIVATE STORAGE BUCKET ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', false)
ON CONFLICT (id) DO NOTHING;

-- ── 4. STORAGE RLS (authenticated = trusted) ──────────────────────────
DROP POLICY IF EXISTS chat_media_read   ON storage.objects;
DROP POLICY IF EXISTS chat_media_insert ON storage.objects;
DROP POLICY IF EXISTS chat_media_delete ON storage.objects;

CREATE POLICY chat_media_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'chat-media');

CREATE POLICY chat_media_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat-media');

-- Only the uploader (objects.owner = auth.uid()) or a manager may
-- delete an attachment, matching chat_messages_delete.
CREATE POLICY chat_media_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'chat-media'
    AND (owner = auth.uid() OR public.cw_is_manager())
  );
