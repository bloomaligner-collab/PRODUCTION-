-- 20260423220000_employee_notification_prefs.sql
--
-- Per-user channel opt-out for Cedarwings notifications. JSONB
-- column so we can add future channels / event-types without a
-- schema change. Any missing key means "enabled" (backwards-
-- compatible default), so existing behaviour is preserved for
-- users who never touch their preferences.
--
-- Example value:
--   {"email": true, "whatsapp": false, "sms": true}
-- means: email me, skip WhatsApp, send SMS.

ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS notification_prefs JSONB NOT NULL
  DEFAULT '{"email": true, "whatsapp": true, "sms": true}'::jsonb;

-- Backfill rows that existed before the default was set
-- (the DEFAULT only applies to rows inserted after the ALTER).
UPDATE public.employees
   SET notification_prefs = '{"email": true, "whatsapp": true, "sms": true}'::jsonb
 WHERE notification_prefs IS NULL
    OR notification_prefs = '{}'::jsonb;
