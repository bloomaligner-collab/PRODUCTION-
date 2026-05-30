alter table public.inventory_requisitions
  add column if not exists approved_at timestamp with time zone,
  add column if not exists fulfilled_at timestamp with time zone;
