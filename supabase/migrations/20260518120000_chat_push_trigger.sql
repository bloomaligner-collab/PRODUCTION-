-- 20260518120000_chat_push_trigger.sql
--
-- Auto-invoke the chat-push Edge Function on every new chat message
-- via pg_net (no dashboard Webhook needed). Applied to
-- cvrmadmzzualqukxxlro on 2026-05-18.
--
-- NOTE: the live trigger embeds the real CHAT_PUSH_SECRET and the
-- project anon key in the request headers. They are intentionally
-- redacted here so the repo doesn't carry the secret — set
-- <CHAT_PUSH_SECRET> to the same value as the chat-push function's
-- CHAT_PUSH_SECRET env var if you re-run this.

CREATE OR REPLACE FUNCTION public.cw_chat_push_notify()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM net.http_post(
    'https://cvrmadmzzualqukxxlro.supabase.co/functions/v1/chat-push',
    jsonb_build_object('record', to_jsonb(NEW)),
    '{}'::jsonb,
    jsonb_build_object(
      'Content-Type','application/json',
      'x-webhook-secret','<CHAT_PUSH_SECRET>',
      'apikey','<SUPABASE_ANON_KEY>'
    ),
    5000
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;  -- never block a message insert on push failure
END $$;

DROP TRIGGER IF EXISTS chat_messages_push ON public.chat_messages;
CREATE TRIGGER chat_messages_push
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.cw_chat_push_notify();
