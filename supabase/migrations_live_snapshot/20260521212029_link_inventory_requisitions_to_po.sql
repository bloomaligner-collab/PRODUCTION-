alter table public.inventory_requisitions
  add column if not exists po_id uuid,
  add column if not exists po_number text;

alter table public.inventory_requisitions
  drop constraint if exists inventory_requisitions_status_check;
alter table public.inventory_requisitions
  add constraint inventory_requisitions_status_check
  check (status = any (array['pending','approved','rejected','received','fulfilled','cancelled','sent']));
