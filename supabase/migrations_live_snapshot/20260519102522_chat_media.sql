-- 20260519100000_chat_media.sql
-- Chat attachments (photo / video / voice). Files live in a private
-- chat-media bucket; chat_messages stores the object path.

-- 1. COLUMNS
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_url  text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_type text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_name text;

-- 2. BODY CONSTRAINT — allow media-only messages
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_body_check;
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_body_or_media_chk;
ALTER TABLE public.chat_messages
  ADD CONSTRAINT chat_messages_body_or_media_chk
  CHECK (
    char_length(body) <= 4000
    AND (char_length(btrim(body)) >= 1 OR media_url IS NOT NULL)
  );

-- 3. PRIVATE STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', false)
ON CONFLICT (id) DO NOTHING;

-- 4. STORAGE RLS (authenticated = trusted)
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
