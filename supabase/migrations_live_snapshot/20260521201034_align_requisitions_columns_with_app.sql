-- The app (inventory.html / requisition.html) and the set_requisition_no
-- trigger reference columns that were never created. Add them so inserts
-- and the auto-requisition flow work.
alter table public.requisitions
  add column if not exists requisition_no text,
  add column if not exists aligners_base integer,
  add column if not exists sent_at timestamp with time zone;
