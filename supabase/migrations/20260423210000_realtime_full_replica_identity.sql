-- 20260423210000_realtime_full_replica_identity.sql
--
-- Supabase Realtime events carry the row's primary key in "old"
-- by default. Realtime UPDATE events therefore can't tell
-- "assigned_to just became me" from "some other column changed
-- on a row that was already mine". Switching these three tables
-- to REPLICA IDENTITY FULL makes Postgres include the complete
-- old row in every WAL entry, so access.js can correctly emit a
-- toast only when the assignment actually flipped to the current
-- user.
--
-- Tradeoff: UPDATE events are slightly larger. For these small,
-- low-volume regulatory tables that's a non-issue.

ALTER TABLE public.customer_feedback      REPLICA IDENTITY FULL;
ALTER TABLE public.non_conformity_reports REPLICA IDENTITY FULL;
ALTER TABLE public.internal_audits        REPLICA IDENTITY FULL;
