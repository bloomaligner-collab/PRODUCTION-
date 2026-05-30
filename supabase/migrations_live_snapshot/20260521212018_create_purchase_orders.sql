create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number text,
  supplier_id uuid,
  supplier_name text,
  supplier_email text,
  status text not null default 'sent' check (status in ('draft','sent','received','cancelled')),
  source text,            -- 'inventory_queue' | 'requisition'
  source_ref text,        -- originating requisition id (when applicable)
  item_count integer default 0,
  total_cost numeric default 0,
  currency text,
  notes text,
  created_by text,
  emailed_at timestamptz,
  email_status text,      -- 'sent' | 'failed' | 'no_email'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.purchase_order_lines (
  id uuid primary key default gen_random_uuid(),
  po_id uuid not null references public.purchase_orders(id) on delete cascade,
  item_name text not null,
  quantity numeric,
  unit text,
  unit_cost numeric,
  line_total numeric,
  bom_id uuid,
  created_at timestamptz default now()
);

create index if not exists idx_po_lines_po on public.purchase_order_lines(po_id);
create index if not exists idx_po_source on public.purchase_orders(source, source_ref);

-- auto PO number: PO-YYYY-NNNN
create or replace function public.generate_po_number()
returns trigger language plpgsql set search_path to 'public','pg_temp' as $$
declare yr text := to_char(now(),'YYYY'); seq int;
begin
  if new.po_number is null or new.po_number = '' then
    select count(*)+1 into seq from purchase_orders
      where to_char(created_at,'YYYY') = yr;
    new.po_number := 'PO-' || yr || '-' || lpad(seq::text,4,'0');
  end if;
  return new;
end $$;

drop trigger if exists set_po_number on public.purchase_orders;
create trigger set_po_number before insert on public.purchase_orders
  for each row execute function public.generate_po_number();

-- RLS to match the rest of the app (authenticated full access)
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_lines enable row level security;

drop policy if exists purchase_orders_authenticated_all on public.purchase_orders;
create policy purchase_orders_authenticated_all on public.purchase_orders
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists purchase_order_lines_authenticated_all on public.purchase_order_lines;
create policy purchase_order_lines_authenticated_all on public.purchase_order_lines
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
