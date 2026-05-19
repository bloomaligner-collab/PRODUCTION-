-- 20260519160000_bloom_snaps_case_synced_index.sql
--
-- The History tab orders by synced_at DESC. With only idx_snaps_case
-- (case_id) and idx_snaps_synced (synced_at), a query like
--   WHERE case_id = '5516' ORDER BY synced_at DESC LIMIT 50
-- made the planner walk the synced_at index and *filter* by case_id —
-- for a case whose snapshots aren't recent, that scans millions of
-- rows and hits the statement timeout. This composite index lets that
-- query be a direct index range scan (verified ~4ms for any case).
--
-- On the live 10.6M-row table this was built CONCURRENTLY (online, no
-- write lock):
--   CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_snaps_case_synced
--     ON public.bloom_case_snapshots (case_id, synced_at DESC);
-- Applied to cvrmadmzzualqukxxlro on 2026-05-19. The plain form below
-- is for seeding a fresh / small environment via `supabase db push`.

CREATE INDEX IF NOT EXISTS idx_snaps_case_synced
  ON public.bloom_case_snapshots (case_id, synced_at DESC);
