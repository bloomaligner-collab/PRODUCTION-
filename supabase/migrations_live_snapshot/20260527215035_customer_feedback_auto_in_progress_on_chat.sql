-- Extend the chat trigger: when the assignee sends a reply on a still-open case,
-- promote the case to in_progress (in addition to the existing ball-in-court flip).
CREATE OR REPLACE FUNCTION public.flip_cf_next_action_on_chat()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender_name text;
  v_case        public.customer_feedback%ROWTYPE;
  v_new_status  text;
BEGIN
  IF NEW.case_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT * INTO v_case FROM public.customer_feedback WHERE id = NEW.case_id;
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  IF v_case.status IS NOT NULL AND v_case.status IN ('closed','resolved') THEN
    RETURN NEW;
  END IF;
  SELECT name INTO v_sender_name
  FROM public.employees
  WHERE id = NEW.sender_id
  LIMIT 1;
  IF v_sender_name IS NULL THEN
    RETURN NEW;
  END IF;
  IF v_case.assigned_to IS NOT NULL AND v_sender_name = v_case.assigned_to THEN
    -- Assignee replied → ball goes to creator; auto-promote open → in_progress
    v_new_status := CASE WHEN v_case.status = 'open' THEN 'in_progress' ELSE v_case.status END;
    UPDATE public.customer_feedback
       SET next_action_by = v_case.received_by,
           status = v_new_status,
           updated_at = now()
     WHERE id = NEW.case_id;
  ELSIF v_case.received_by IS NOT NULL AND v_sender_name = v_case.received_by THEN
    UPDATE public.customer_feedback
       SET next_action_by = v_case.assigned_to,
           updated_at = now()
     WHERE id = NEW.case_id;
  END IF;
  RETURN NEW;
END;
$$;
