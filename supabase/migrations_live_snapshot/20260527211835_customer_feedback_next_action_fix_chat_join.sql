-- Fix: chat_messages.sender_id matches employees.id (not auth_user_id)
CREATE OR REPLACE FUNCTION public.flip_cf_next_action_on_chat()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender_name text;
  v_case        public.customer_feedback%ROWTYPE;
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
    UPDATE public.customer_feedback
       SET next_action_by = v_case.received_by,
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

-- Re-backfill now that the join works
WITH latest_msg AS (
  SELECT DISTINCT ON (case_id) case_id, sender_id
  FROM public.chat_messages
  WHERE case_id IS NOT NULL
  ORDER BY case_id, created_at DESC
),
latest_sender AS (
  SELECT lm.case_id, e.name AS last_sender_name
  FROM latest_msg lm
  LEFT JOIN public.employees e ON e.id = lm.sender_id
)
UPDATE public.customer_feedback cf
SET next_action_by = (
  CASE
    WHEN ls.last_sender_name = cf.assigned_to THEN cf.received_by
    WHEN ls.last_sender_name = cf.received_by THEN cf.assigned_to
    ELSE cf.assigned_to
  END
)
FROM latest_sender ls
WHERE cf.id = ls.case_id
  AND (cf.status IS NULL OR cf.status NOT IN ('closed','resolved'));
