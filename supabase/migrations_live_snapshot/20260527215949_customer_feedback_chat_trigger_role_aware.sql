-- Helper: does an employee fill a given assignee key?
-- Key can be a literal name ("Imad") or a role marker ("role:Quality Manager").
-- Role match considers role, custom_role, and the extra_roles jsonb array.
CREATE OR REPLACE FUNCTION public.employee_matches_assignee(p_emp_id uuid, p_key text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name        text;
  v_role        text;
  v_custom_role text;
  v_extra       jsonb;
  v_target      text;
BEGIN
  IF p_key IS NULL OR p_emp_id IS NULL THEN RETURN false; END IF;
  SELECT name, role, custom_role, extra_roles INTO v_name, v_role, v_custom_role, v_extra
  FROM public.employees WHERE id = p_emp_id LIMIT 1;
  IF NOT FOUND THEN RETURN false; END IF;
  IF p_key = v_name THEN RETURN true; END IF;
  IF p_key LIKE 'role:%' THEN
    v_target := substring(p_key FROM 6);
    IF v_target = v_role OR v_target = v_custom_role THEN RETURN true; END IF;
    IF v_extra IS NOT NULL AND v_extra ? v_target THEN RETURN true; END IF;
  END IF;
  RETURN false;
END;
$$;

-- Role-aware version of the chat trigger:
-- · Assignee key may be literal or "role:X" — the sender matches if their
--   primary/custom/extra roles include X.
-- · Same for received_by (rare but possible).
-- · On assignee reply: status open → in_progress, ball flips to creator.
-- · On creator reply: ball flips to assignee.
CREATE OR REPLACE FUNCTION public.flip_cf_next_action_on_chat()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_case        public.customer_feedback%ROWTYPE;
  v_new_status  text;
  v_is_assignee boolean;
  v_is_creator  boolean;
BEGIN
  IF NEW.case_id IS NULL THEN RETURN NEW; END IF;
  SELECT * INTO v_case FROM public.customer_feedback WHERE id = NEW.case_id;
  IF NOT FOUND THEN RETURN NEW; END IF;
  IF v_case.status IS NOT NULL AND v_case.status IN ('closed','resolved') THEN RETURN NEW; END IF;
  v_is_assignee := public.employee_matches_assignee(NEW.sender_id, v_case.assigned_to);
  v_is_creator  := public.employee_matches_assignee(NEW.sender_id, v_case.received_by);
  IF v_is_assignee AND NOT v_is_creator THEN
    v_new_status := CASE WHEN v_case.status = 'open' THEN 'in_progress' ELSE v_case.status END;
    UPDATE public.customer_feedback
       SET next_action_by = v_case.received_by,
           status         = v_new_status,
           updated_at     = now()
     WHERE id = NEW.case_id;
  ELSIF v_is_creator AND NOT v_is_assignee THEN
    UPDATE public.customer_feedback
       SET next_action_by = v_case.assigned_to,
           updated_at     = now()
     WHERE id = NEW.case_id;
  END IF;
  RETURN NEW;
END;
$$;
