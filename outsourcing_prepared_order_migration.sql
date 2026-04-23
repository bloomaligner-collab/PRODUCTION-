-- ============================================================
-- Cedarwings SAS — Outsourcing v2: Prepared List Order
--   · default distributor + default price on suppliers
--   · PO grouping + invoice dates on outsourced_orders
-- Run in Supabase SQL Editor (idempotent)
-- ============================================================

-- 1. SUPPLIERS — default distributor + default aligner price ──
alter table suppliers add column if not exists is_default_distributor boolean not null default false;
alter table suppliers add column if not exists default_price_per_aligner numeric(10,2);
alter table suppliers add column if not exists default_currency text default 'EUR';

-- Only one supplier can be the default distributor at a time
create unique index if not exists ux_suppliers_one_default
  on suppliers ((is_default_distributor))
  where is_default_distributor = true;

-- 2. OUTSOURCED_ORDERS — PO grouping + invoice lifecycle ─────
create table if not exists outsourced_orders (
  id uuid primary key default gen_random_uuid(),
  case_id text not null,
  supplier_id uuid references suppliers(id) on delete set null,
  supplier_name text,
  outsource_date date not null default current_date,
  expected_return_date date,
  received_date date,
  aligners_upper integer default 0,
  aligners_lower integer default 0,
  aligners_total integer generated always as (coalesce(aligners_upper,0)+coalesce(aligners_lower,0)) stored,
  cost_per_aligner numeric(10,2) default 0,
  total_cost numeric(12,2) default 0,
  currency text default 'EUR',
  notes text,
  created_by text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending','approved','paid','disputed')),
  invoice_no text,
  paid_amount numeric(12,2),
  paid_date date,
  updated_at timestamptz,
  created_at timestamptz not null default now()
);

-- Add new columns if table already existed
alter table outsourced_orders add column if not exists po_number text;
alter table outsourced_orders add column if not exists invoice_expected_date date;
alter table outsourced_orders add column if not exists invoice_received_date date;

create index if not exists ix_out_orders_po on outsourced_orders(po_number);
create index if not exists ix_out_orders_case on outsourced_orders(case_id);
create index if not exists ix_out_orders_expected on outsourced_orders(expected_return_date);

-- RLS (open to match rest of app — tighten later if auth is enforced)
alter table outsourced_orders enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='outsourced_orders' and policyname='outsourced_orders_all') then
    create policy outsourced_orders_all on outsourced_orders for all using (true) with check (true);
  end if;
end $$;
