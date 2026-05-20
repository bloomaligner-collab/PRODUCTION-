-- 20260520140000_audit_module_extensions.sql
--
-- Schema deltas requested by the 2026-05-20 QMS audit:
--   • Customer Feedback: Lot/UDI, Investigation started/result, Root cause
--     (own column), CAPA flag + linked id, Vigilance flag + reference.
--   • Quality Control: link a rejected lot to its NC, record the final QC
--     procedure reference, and capture measures taken.
--   • Suppliers: certifications & contracts with expiry — new
--     supplier_documents table (kind ∈ certification|contract|other).
--   • CAPAs separated from Non-Conformities — new `capa` register.
-- Inventory's "storage_conditions" was already in the schema and is now
-- exposed in the UI.
--
-- Applied to cvrmadmzzualqukxxlro on 2026-05-20. Additive; no data
-- migration needed (existing NC.root_cause / corrective_action stay as
-- they are; new CAPAs are written into the new `capa` table going forward).

ALTER TABLE public.customer_feedback
  ADD COLUMN IF NOT EXISTS lot_udi text,
  ADD COLUMN IF NOT EXISTS investigation_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS investigation_result text,
  ADD COLUMN IF NOT EXISTS root_cause text,
  ADD COLUMN IF NOT EXISTS capa_required boolean,
  ADD COLUMN IF NOT EXISTS capa_id uuid,
  ADD COLUMN IF NOT EXISTS vigilance_reportable boolean,
  ADD COLUMN IF NOT EXISTS vigilance_id text;

ALTER TABLE public.quality_controls
  ADD COLUMN IF NOT EXISTS nc_id uuid REFERENCES public.non_conformity_reports(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS procedure_ref text,
  ADD COLUMN IF NOT EXISTS measures_taken text;

CREATE TABLE IF NOT EXISTS public.supplier_documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id   uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  kind          text NOT NULL CHECK (kind IN ('certification','contract','other')),
  title         text,
  issuer        text,
  reference_no  text,
  valid_from    date,
  expires_at    date,
  attachment_url text,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    text
);
CREATE INDEX IF NOT EXISTS supplier_documents_supplier_idx ON public.supplier_documents(supplier_id);
CREATE INDEX IF NOT EXISTS supplier_documents_expires_idx  ON public.supplier_documents(expires_at);
ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS supplier_documents_authenticated_all ON public.supplier_documents;
CREATE POLICY supplier_documents_authenticated_all ON public.supplier_documents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.capa (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  capa_no            text UNIQUE,
  source_type        text CHECK (source_type IN ('nc','feedback','audit','other')),
  source_id          uuid,
  title              text,
  problem_statement  text,
  root_cause         text,
  action_plan        text,
  owner              text,
  due_date           date,
  status             text NOT NULL DEFAULT 'open'
                       CHECK (status IN ('open','in_progress','verified','closed','cancelled')),
  opened_at          timestamptz NOT NULL DEFAULT now(),
  closed_at          timestamptz,
  verified_by        text,
  verified_at        timestamptz,
  effectiveness_check text,
  effectiveness_at   timestamptz,
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  created_by         text
);
CREATE INDEX IF NOT EXISTS capa_status_idx ON public.capa(status);
CREATE INDEX IF NOT EXISTS capa_source_idx ON public.capa(source_type, source_id);
ALTER TABLE public.capa ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS capa_authenticated_all ON public.capa;
CREATE POLICY capa_authenticated_all ON public.capa
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customer_feedback_capa_fk'
  ) THEN
    ALTER TABLE public.customer_feedback
      ADD CONSTRAINT customer_feedback_capa_fk
      FOREIGN KEY (capa_id) REFERENCES public.capa(id) ON DELETE SET NULL;
  END IF;
END $$;
