-- 20260519150000_bloom_scd_parsed_view.sql
--
-- The Bloom Import "History / Snapshots" tab couldn't filter by the
-- "Status Changed" date server-side because bloom_case_snapshots
-- .status_change_date is DD.MM.YYYY *text* (not range-comparable in
-- PostgREST). With ~10.6M rows, a client-side filter is impossible.
--
-- Fix: an IMMUTABLE parser + a security_invoker view that exposes a
-- real `status_change_dt` date the client can .gte()/.lte() on. The
-- History tab queries this view and orders by synced_at DESC (which
-- is index-backed by idx_snaps_synced), so paging/filtering stays
-- fast without a full-table sort.
--
-- Applied to cvrmadmzzualqukxxlro on 2026-05-19.

CREATE OR REPLACE FUNCTION public.cw_parse_ddmmyyyy(s text)
RETURNS date
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog
AS $$
BEGIN
  IF s IS NULL OR s !~ '^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$' THEN
    RETURN NULL;
  END IF;
  RETURN make_date(
    split_part(s, '.', 3)::int,
    split_part(s, '.', 2)::int,
    split_part(s, '.', 1)::int);
EXCEPTION WHEN others THEN
  RETURN NULL;
END $$;

CREATE OR REPLACE VIEW public.bloom_case_snapshots_hist
WITH (security_invoker = on) AS
  SELECT *, public.cw_parse_ddmmyyyy(status_change_date) AS status_change_dt
  FROM public.bloom_case_snapshots;

GRANT SELECT ON public.bloom_case_snapshots_hist TO authenticated;

-- Optional: a functional index on the parsed date helps only when the
-- status-changed range is the primary (most selective) filter; the
-- History queries are already bounded by the synced_at index + LIMIT.
-- On the live 10.6M-row table build it CONCURRENTLY out-of-band to
-- avoid a write lock:
--   CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_snaps_scd_parsed
--     ON public.bloom_case_snapshots (public.cw_parse_ddmmyyyy(status_change_date));
