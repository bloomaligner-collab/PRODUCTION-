-- 20260530230000_qc_before_delivery_gate.sql
--
-- Hard QC-before-delivery gate (applied live 2026-05-30).
--
-- A case may not be marked "fully completed / ready to deliver" (the
-- production_completion_log action='completed' event written by
-- production.html confirmCompletion) unless an APPROVED quality_controls record
-- exists for that case. The QC form (qualite.html) sets overall_result =
-- 'approved' only when every checkpoint passes — aligner quality, treatment-plan
-- match (fit/qty/dimensional), packaging, label and documentation/shipping — so
-- a single approved QC satisfies all four required dimensions.
--
-- Kill-switch: system_settings key 'qc_gate_enabled' (default 'true' = hard-block
-- immediately). Set to 'false' to disable instantly with no migration; the
-- KPI & Incentive page exposes a one-click toggle for admins.
--
-- Enforced at the DB so it cannot be bypassed via the API; production.html also
-- pre-checks and shows a friendly message before writing anything.

INSERT INTO public.system_settings(key, value, updated_at)
VALUES ('qc_gate_enabled', 'true', now())
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.enforce_qc_before_delivery()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','pg_temp'
AS $$
DECLARE
  v_enabled text;
  v_has_qc  boolean;
BEGIN
  IF lower(coalesce(NEW.action,'')) <> 'completed' THEN
    RETURN NEW;
  END IF;

  SELECT value INTO v_enabled FROM public.system_settings WHERE key = 'qc_gate_enabled';
  IF lower(coalesce(v_enabled,'true')) NOT IN ('true','1','yes','on') THEN
    RETURN NEW;  -- gate disabled
  END IF;

  IF NEW.case_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.quality_controls q
    WHERE lower(coalesce(q.overall_result, q.result, '')) IN ('approved','pass','passed')
      AND (q.case_id::text = NEW.case_id::text OR q.order_no::text = NEW.case_id::text)
  ) INTO v_has_qc;

  IF NOT v_has_qc THEN
    RAISE EXCEPTION 'QC gate: this case has no approved quality control. Complete and approve QC (aligner quality, treatment-plan match, packaging, shipping) before marking it ready for delivery.'
      USING errcode = '42501';
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS enforce_qc_before_delivery ON public.production_completion_log;
CREATE TRIGGER enforce_qc_before_delivery
  BEFORE INSERT ON public.production_completion_log
  FOR EACH ROW EXECUTE FUNCTION public.enforce_qc_before_delivery();
