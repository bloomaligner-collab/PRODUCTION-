-- Ball-in-court tracking for customer feedback cases.
-- `assigned_to` already tracks long-term ownership; this new field tracks
-- who must act next. It auto-flips when the other party replies in chat.

ALTER TABLE public.customer_feedback
  ADD COLUMN IF NOT EXISTS next_action_by text;

CREATE INDEX IF NOT EXISTS idx_cf_next_action_by ON public.customer_feedback(next_action_by);

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
  WHERE auth_user_id = NEW.sender_id
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

DROP TRIGGER IF EXISTS chat_flip_cf_next_action ON public.chat_messages;
CREATE TRIGGER chat_flip_cf_next_action
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.flip_cf_next_action_on_chat();

-- Backfill: for active cases, set next_action_by based on the last chat message
-- (whoever didn't send it). Cases with no chat default to the assignee (they owe
-- the first response).
WITH latest_msg AS (
  SELECT DISTINCT ON (case_id) case_id, sender_id
  FROM public.chat_messages
  WHERE case_id IS NOT NULL
  ORDER BY case_id, created_at DESC
),
latest_sender AS (
  SELECT lm.case_id, e.name AS last_sender_name
  FROM latest_msg lm
  LEFT JOIN public.employees e ON e.auth_user_id = lm.sender_id
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

UPDATE public.customer_feedback
SET next_action_by = assigned_to
WHERE next_action_by IS NULL
  AND assigned_to IS NOT NULL
  AND (status IS NULL OR status NOT IN ('closed','resolved'));
