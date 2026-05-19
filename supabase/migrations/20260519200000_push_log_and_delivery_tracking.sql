-- 20260519200000_push_log_and_delivery_tracking.sql
--
-- Delivery log for Web Push (the notifications dashboard). One row per
-- recipient per notification. status = sent|failed; opened_at is
-- stamped by the push-ack Edge Function when the user clicks it.
-- Writes are service-role only (Edge Functions); any signed-in user
-- may read it for the dashboard. Applied to cvrmadmzzualqukxxlro
-- on 2026-05-19.

CREATE TABLE IF NOT EXISTS public.push_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  kind          text NOT NULL,                 -- chat | assignment | reminder
  case_id       uuid,
  employee_id   uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  recipient_name text,
  title         text,
  body          text,
  url           text,
  status        text NOT NULL DEFAULT 'sent',   -- sent | failed
  error         text,
  opened_at     timestamptz
);
CREATE INDEX IF NOT EXISTS push_log_created_idx ON public.push_log (created_at DESC);
CREATE INDEX IF NOT EXISTS push_log_case_idx    ON public.push_log (case_id);
CREATE INDEX IF NOT EXISTS push_log_emp_idx     ON public.push_log (employee_id, created_at DESC);

ALTER TABLE public.push_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS push_log_select ON public.push_log;
CREATE POLICY push_log_select ON public.push_log
  FOR SELECT TO authenticated USING (true);
