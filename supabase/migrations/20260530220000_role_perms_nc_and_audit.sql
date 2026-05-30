-- 20260530220000_role_perms_nc_and_audit.sql
--
-- Extends the per-role permission framework to Non-Conformity (NC) and
-- Internal Audit, configured in role setup (roles.html).
--
-- NOTE: both tables previously allowed ANY authenticated user to do everything
-- (a single permissive ALL policy, no guards). This migration both adds the
-- feature and tightens security. These modules have no per-record ownership
-- model, so SELECT / INSERT / UPDATE stay open to authenticated users; only the
-- sensitive actions are gated:
--   · DELETE             → managers/admins OR a role flagged can_delete_<module>
--   · CLOSE NC           → managers/admins OR a role flagged can_close_nc
--   · COMPLETE audit     → managers/admins OR a role flagged can_complete_audit
--
-- Applied to the live project on 2026-05-30.

ALTER TABLE public.role_templates
  ADD COLUMN IF NOT EXISTS can_close_nc        boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_delete_nc       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_complete_audit  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_delete_audit    boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.cw_user_has_role_flag(p_flag text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_prole text; v_role text; v_extra_raw jsonb; v_extra jsonb := '[]'::jsonb;
  v_held text[];
BEGIN
  IF private.is_manager() THEN RETURN true; END IF;
  SELECT lower(coalesce(custom_role, role)), lower(role), extra_roles
    INTO v_prole, v_role, v_extra_raw
    FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;
  IF v_prole IS NULL THEN RETURN false; END IF;

  BEGIN
    IF v_extra_raw IS NULL THEN v_extra := '[]'::jsonb;
    ELSIF jsonb_typeof(v_extra_raw) = 'array'  THEN v_extra := v_extra_raw;
    ELSIF jsonb_typeof(v_extra_raw) = 'string' THEN
      v_extra := COALESCE(NULLIF(v_extra_raw #>> '{}', '')::jsonb, '[]'::jsonb);
    ELSE v_extra := '[]'::jsonb;
    END IF;
    IF jsonb_typeof(v_extra) <> 'array' THEN v_extra := '[]'::jsonb; END IF;
  EXCEPTION WHEN others THEN v_extra := '[]'::jsonb;
  END;

  v_held := ARRAY[v_prole, v_role]
            || COALESCE((SELECT array_agg(lower(x)) FROM jsonb_array_elements_text(v_extra) AS t(x)), ARRAY[]::text[]);

  RETURN EXISTS (
    SELECT 1 FROM public.role_templates rt
    WHERE lower(rt.name) = ANY(v_held)
      AND CASE p_flag
            WHEN 'can_close_nc'       THEN rt.can_close_nc
            WHEN 'can_delete_nc'      THEN rt.can_delete_nc
            WHEN 'can_complete_audit' THEN rt.can_complete_audit
            WHEN 'can_delete_audit'   THEN rt.can_delete_audit
            ELSE false
          END
  );
END $$;
REVOKE EXECUTE ON FUNCTION public.cw_user_has_role_flag(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.cw_user_has_role_flag(text) TO authenticated;

-- ── Non-Conformity ──
DROP POLICY IF EXISTS non_conformity_reports_authenticated_all ON public.non_conformity_reports;
CREATE POLICY nc_select ON public.non_conformity_reports FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY nc_insert ON public.non_conformity_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY nc_update ON public.non_conformity_reports FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY nc_delete ON public.non_conformity_reports FOR DELETE TO authenticated
  USING (public.cw_is_manager() OR public.cw_user_has_role_flag('can_delete_nc'));

CREATE OR REPLACE FUNCTION public.nc_enforce_close()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public','pg_temp'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF (OLD.status IS DISTINCT FROM 'closed') AND (NEW.status = 'closed')
     AND NOT public.cw_user_has_role_flag('can_close_nc') THEN
    RAISE EXCEPTION 'You do not have permission to close non-conformity reports.'
      USING errcode = '42501';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS nc_enforce_close ON public.non_conformity_reports;
CREATE TRIGGER nc_enforce_close BEFORE UPDATE ON public.non_conformity_reports
  FOR EACH ROW EXECUTE FUNCTION public.nc_enforce_close();

-- ── Internal Audit ──
DROP POLICY IF EXISTS internal_audits_authenticated_all ON public.internal_audits;
CREATE POLICY ia_select ON public.internal_audits FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY ia_insert ON public.internal_audits FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY ia_update ON public.internal_audits FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY ia_delete ON public.internal_audits FOR DELETE TO authenticated
  USING (public.cw_is_manager() OR public.cw_user_has_role_flag('can_delete_audit'));

CREATE OR REPLACE FUNCTION public.ia_enforce_complete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public','pg_temp'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF (OLD.status IS DISTINCT FROM 'completed') AND (NEW.status = 'completed')
     AND NOT public.cw_user_has_role_flag('can_complete_audit') THEN
    RAISE EXCEPTION 'You do not have permission to mark audits completed.'
      USING errcode = '42501';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS ia_enforce_complete ON public.internal_audits;
CREATE TRIGGER ia_enforce_complete BEFORE UPDATE ON public.internal_audits
  FOR EACH ROW EXECUTE FUNCTION public.ia_enforce_complete();
