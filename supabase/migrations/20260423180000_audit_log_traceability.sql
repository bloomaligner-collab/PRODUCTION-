-- 20260423180000_audit_log_traceability.sql
--
-- ISO 13485 §4.2.5 / §7.5.9 require traceability of record
-- changes in the quality management system. Until now, this
-- project had no generic audit trail — only ad-hoc logs
-- (bloom_sync_log, notification_log, inventory_stock_history).
--
-- This migration adds:
--  1. public.audit_log       — single append-only table
--  2. public.audit_trigger_fn — generic trigger function
--                              (SECURITY DEFINER, STABLE-ish)
--  3. triggers on 10 regulatory-sensitive tables
--  4. RLS: managers read, no one writes manually (the SECURITY
--     DEFINER trigger is the only write path)

-- ============================================================
-- 1. audit_log TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id           BIGSERIAL PRIMARY KEY,
  at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_uid    UUID,
  actor_email  TEXT,
  actor_role   TEXT,
  table_name   TEXT NOT NULL,
  record_pk    TEXT,
  op           TEXT NOT NULL CHECK (op IN ('INSERT','UPDATE','DELETE')),
  old_data     JSONB,
  new_data     JSONB
);
CREATE INDEX IF NOT EXISTS audit_log_at_idx    ON public.audit_log (at DESC);
CREATE INDEX IF NOT EXISTS audit_log_table_idx ON public.audit_log (table_name, at DESC);
CREATE INDEX IF NOT EXISTS audit_log_actor_idx ON public.audit_log (actor_uid, at DESC);

-- ============================================================
-- 2. audit_trigger_fn()
-- ============================================================
CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  pk_val       TEXT;
  caller_email TEXT;
  caller_role  TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    pk_val := COALESCE(
      (to_jsonb(OLD)->>'id'),
      (to_jsonb(OLD)->>'key'),
      (to_jsonb(OLD)->>'case_id')
    );
  ELSE
    pk_val := COALESCE(
      (to_jsonb(NEW)->>'id'),
      (to_jsonb(NEW)->>'key'),
      (to_jsonb(NEW)->>'case_id')
    );
  END IF;

  SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
  SELECT role INTO caller_role
    FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;

  INSERT INTO public.audit_log (
    actor_uid, actor_email, actor_role,
    table_name, record_pk, op,
    old_data, new_data
  ) VALUES (
    auth.uid(), caller_email, caller_role,
    TG_TABLE_NAME, pk_val, TG_OP,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
  );

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.audit_trigger_fn() FROM PUBLIC;

-- ============================================================
-- 3. Attach triggers
-- ============================================================
DO $$
DECLARE
  t text;
  tbls text[] := ARRAY[
    'employees',
    'role_templates',
    'system_settings',
    'production_records',
    'production_lots',
    'quality_controls',
    'non_conformity_reports',
    'traceability',
    'customer_feedback',
    'internal_audits'
  ];
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS audit_trigger ON public.%I', t);
    EXECUTE format(
      'CREATE TRIGGER audit_trigger
         AFTER INSERT OR UPDATE OR DELETE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn()',
      t
    );
  END LOOP;
END $$;

-- ============================================================
-- 4. RLS on audit_log
-- ============================================================
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS audit_log_manager_read ON public.audit_log;
CREATE POLICY audit_log_manager_read ON public.audit_log
  FOR SELECT TO authenticated
  USING (public.is_manager());
