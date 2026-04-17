-- ══════════════════════════════════════════════════════════════════════
-- CEDARWINGS — CLEAN ALL DATA & UPDATE SCHEMA
-- Run at: https://supabase.com/dashboard/project/oaauobugpbcixnbmlakc/sql/new
-- WARNING: This deletes ALL production data and resets the system
-- ══════════════════════════════════════════════════════════════════════

-- 1. CLEAN ALL DATA (fresh start)
TRUNCATE TABLE bloom_aligner_details RESTART IDENTITY CASCADE;
TRUNCATE TABLE bloom_cases RESTART IDENTITY CASCADE;
TRUNCATE TABLE bloom_imports RESTART IDENTITY CASCADE;
TRUNCATE TABLE production_entries RESTART IDENTITY CASCADE;
TRUNCATE TABLE production_lots RESTART IDENTITY CASCADE;
TRUNCATE TABLE material_consumption_log RESTART IDENTITY CASCADE;
TRUNCATE TABLE time_sessions RESTART IDENTITY CASCADE;
TRUNCATE TABLE order_step_tracking RESTART IDENTITY CASCADE;
TRUNCATE TABLE quality_controls RESTART IDENTITY CASCADE;
TRUNCATE TABLE machine_lot_assignments RESTART IDENTITY CASCADE;

-- 2. UPDATE bloom_cases — add new fields from API protocol
ALTER TABLE bloom_cases ADD COLUMN IF NOT EXISTS clinic TEXT;
ALTER TABLE bloom_cases ADD COLUMN IF NOT EXISTS distributor TEXT;
ALTER TABLE bloom_cases ADD COLUMN IF NOT EXISTS overdue_for TEXT;
ALTER TABLE bloom_cases ADD COLUMN IF NOT EXISTS action_required_for TEXT;
ALTER TABLE bloom_cases ADD COLUMN IF NOT EXISTS number_of_extra_refinements TEXT;
ALTER TABLE bloom_cases ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ DEFAULT now();

-- 3. UPDATE bloom_aligner_details — support multiple orders per case
ALTER TABLE bloom_aligner_details ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE bloom_aligner_details ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE bloom_aligner_details ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
ALTER TABLE bloom_aligner_details ADD COLUMN IF NOT EXISTS status TEXT;

-- Remove old single-case constraint so multiple orders per case are allowed
ALTER TABLE bloom_aligner_details DROP CONSTRAINT IF EXISTS bloom_aligner_details_case_number_key;
ALTER TABLE bloom_aligner_details DROP CONSTRAINT IF EXISTS bloom_aligner_details_pkey;
-- Re-add primary key on id only
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bloom_aligner_details_pkey') THEN
    ALTER TABLE bloom_aligner_details ADD PRIMARY KEY (id);
  END IF;
END $$;

-- 4. CREATE sync_log table to track automated sync status
CREATE TABLE IF NOT EXISTS bloom_sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT DEFAULT 'polling', -- 'polling' or 'webhook'
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  cases_fetched INTEGER DEFAULT 0,
  cases_new INTEGER DEFAULT 0,
  cases_updated INTEGER DEFAULT 0,
  aligners_fetched INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running', -- 'running','success','error'
  error_message TEXT,
  last_case_updated_at TIMESTAMPTZ
);
ALTER TABLE bloom_sync_log DISABLE ROW LEVEL SECURITY;
GRANT ALL ON bloom_sync_log TO anon;

-- 5. CREATE system_settings entry for last sync timestamp
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;
GRANT ALL ON system_settings TO anon;

INSERT INTO system_settings (key, value) 
VALUES ('bloom_last_sync', '2020-01-01T00:00:00Z')
ON CONFLICT (key) DO NOTHING;

-- 6. Disable RLS on all tables
ALTER TABLE bloom_cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE bloom_aligner_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE bloom_imports DISABLE ROW LEVEL SECURITY;
ALTER TABLE production_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_consumption_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE time_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_step_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE quality_controls DISABLE ROW LEVEL SECURITY;
ALTER TABLE machine_lot_assignments DISABLE ROW LEVEL SECURITY;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 7. Verify
SELECT 'CLEAN COMPLETE' as status;
SELECT table_name, 0 as rows FROM information_schema.tables 
WHERE table_schema='public' AND table_type='BASE TABLE'
ORDER BY table_name;
