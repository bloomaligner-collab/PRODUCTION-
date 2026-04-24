-- 20260423200000_realtime_my_work_tables.sql
--
-- Adds customer_feedback, non_conformity_reports and internal_audits
-- to the supabase_realtime publication so INSERT/UPDATE/DELETE
-- events on those tables are broadcast to subscribed browser
-- clients. Used by access.js to refresh the sidebar "My Work" badge
-- in ~1s when a row changes, instead of polling every 2 minutes.
--
-- RLS still filters the events — a subscriber only receives change
-- notifications for rows they're permitted to read.

ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE public.non_conformity_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.internal_audits;
