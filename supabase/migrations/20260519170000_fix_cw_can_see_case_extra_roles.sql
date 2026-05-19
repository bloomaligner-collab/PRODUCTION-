-- 20260519170000_fix_cw_can_see_case_extra_roles.sql
--
-- Bug: case-discussion posting failed ("only this case's assignee/
-- team or a manager can write here") for users whose access came
-- from a team / extra role, even though the UI let them type.
--
-- Cause: public.employees.extra_roles is stored DOUBLE-ENCODED — a
-- jsonb *string* whose text is a JSON array (jsonb_typeof = 'string',
-- e.g. "[\"quality_control\",...]"), not a real jsonb array. The
-- browser tolerates that, so it enabled the composer; but
-- cw_can_see_case did `extra_roles::text::jsonb` → a jsonb string
-- scalar → jsonb_array_elements_text() threw → the EXCEPTION block
-- treated the user as having NO extra roles → RLS denied the insert.
--
-- Fix: make cw_can_see_case accept extra_roles in EITHER shape (a
-- proper jsonb array, or a double-encoded jsonb string), unwrapping
-- one level when needed. No employees data is rewritten (the column
-- stays as-is; every reader is now tolerant). SECURITY DEFINER /
-- STABLE / search_path preserved.
--
-- Applied to cvrmadmzzualqukxxlro on 2026-05-19.

CREATE OR REPLACE FUNCTION public.cw_can_see_case(p_case uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_name text; v_prole text; v_role text;
  v_extra_raw jsonb;
  v_extra jsonb := '[]'::jsonb;
  v_assigned text; v_key text;
BEGIN
  SELECT name, lower(coalesce(custom_role, role)), lower(role), extra_roles
    INTO v_name, v_prole, v_role, v_extra_raw
  FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;
  IF v_name IS NULL THEN RETURN false; END IF;
  IF (SELECT role = 'manager' FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1)
  THEN RETURN true; END IF;

  SELECT assigned_to INTO v_assigned FROM public.customer_feedback WHERE id = p_case;
  IF v_assigned IS NULL THEN RETURN false; END IF;

  IF v_assigned NOT LIKE 'role:%' THEN
    RETURN v_assigned = v_name;
  END IF;

  v_key := lower(substr(v_assigned, 6));
  IF v_key = v_prole OR v_key = v_role THEN RETURN true; END IF;

  -- extra_roles may be a proper jsonb array OR (legacy data) a
  -- double-encoded jsonb string whose text is a JSON array. Accept both.
  BEGIN
    IF v_extra_raw IS NULL THEN
      v_extra := '[]'::jsonb;
    ELSIF jsonb_typeof(v_extra_raw) = 'array' THEN
      v_extra := v_extra_raw;
    ELSIF jsonb_typeof(v_extra_raw) = 'string' THEN
      v_extra := COALESCE(NULLIF(v_extra_raw #>> '{}', '')::jsonb, '[]'::jsonb);
    ELSE
      v_extra := '[]'::jsonb;
    END IF;
    IF jsonb_typeof(v_extra) <> 'array' THEN v_extra := '[]'::jsonb; END IF;
  EXCEPTION WHEN others THEN
    v_extra := '[]'::jsonb;
  END;

  RETURN EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(v_extra) AS x
    WHERE lower(x) = v_key
  );
END $function$;
