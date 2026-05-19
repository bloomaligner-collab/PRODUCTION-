-- 20260519210000_case_assignment_push_and_reminder_cron.sql
--
-- (1) follow_up_reminded_at column so the reminder sweep doesn't
--     re-notify the same follow-up more than once per day.
-- (2) AFTER INSERT/UPDATE trigger: when a complaint gains/changes an
--     assignee, pg_net posts the row to the case-notify Edge Function
--     (mode=assignment) → push to the assignee with a case deep link.
-- (3) pg_cron job every 15 min → case-notify?mode=reminder, which
--     pushes due / overdue follow-ups to their owner.
--
-- NOTE: the LIVE trigger/cron embed the real CHAT_PUSH_SECRET and the
-- project anon key in the request headers (same pattern as
-- 20260518120000_chat_push_trigger.sql). They are redacted here so the
-- repo doesn't carry the secret — substitute <CHAT_PUSH_SECRET> and
-- <SUPABASE_ANON_KEY> if re-running. Applied to cvrmadmzzualqukxxlro
-- on 2026-05-19.

ALTER TABLE public.customer_feedback
  ADD COLUMN IF NOT EXISTS follow_up_reminded_at timestamptz;

CREATE OR REPLACE FUNCTION public.cw_cf_assignment_push()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public','pg_temp' AS $$
BEGIN
  IF NEW.assigned_to IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND NEW.assigned_to IS NOT DISTINCT FROM OLD.assigned_to THEN
    RETURN NEW;
  END IF;
  PERFORM net.http_post(
    'https://cvrmadmzzualqukxxlro.supabase.co/functions/v1/case-notify',
    jsonb_build_object('record', to_jsonb(NEW), 'mode','assignment'),
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
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS cf_assignment_push ON public.customer_feedback;
CREATE TRIGGER cf_assignment_push
  AFTER INSERT OR UPDATE ON public.customer_feedback
  FOR EACH ROW EXECUTE FUNCTION public.cw_cf_assignment_push();

DO $$ BEGIN
  PERFORM cron.unschedule('case-reminders-15min');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
SELECT cron.schedule('case-reminders-15min', '*/15 * * * *', $cron$
  SELECT net.http_post(
    'https://cvrmadmzzualqukxxlro.supabase.co/functions/v1/case-notify?mode=reminder',
    '{}'::jsonb, '{}'::jsonb,
    jsonb_build_object(
      'Content-Type','application/json',
      'x-webhook-secret','<CHAT_PUSH_SECRET>',
      'apikey','<SUPABASE_ANON_KEY>'
    ),
    5000);
$cron$);
