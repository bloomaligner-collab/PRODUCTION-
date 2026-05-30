alter table public.inventory_requisitions
  drop constraint if exists inventory_requisitions_status_check;

alter table public.inventory_requisitions
  add constraint inventory_requisitions_status_check
  check (status = any (array['pending','approved','rejected','received','fulfilled','cancelled']));
