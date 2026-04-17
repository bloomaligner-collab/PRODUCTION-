-- ============================================================
-- Cedarwings SAS — New Tables (run in Supabase SQL Editor)
-- ============================================================

-- 1. EMPLOYEES (roles: employee, manager)
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  role text not null default 'employee' check (role in ('employee','manager')),
  pin text,                    -- simple numeric PIN for access
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed a manager account (change PIN to whatever you want)
insert into employees (name, role, pin) values ('Manager', 'manager', '1234')
on conflict (name) do nothing;

-- 2. MACHINES
create table if not exists machines (
  id uuid primary key default gen_random_uuid(),
  machine_name text unique not null,
  machine_type text,           -- Printer, Cleaning, Thermoformer, Laser, Packaging, etc.
  status text not null default 'idle' check (status in ('idle','running','maintenance','offline')),
  notes text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

insert into machines (machine_name, machine_type) values
  ('3D Printing Machine 1', 'Printer'),
  ('3D Printing Machine 2', 'Printer'),
  ('Cleaning Station', 'Cleaning'),
  ('Thermoforming Machine 1', 'Thermoformer'),
  ('Line Cut Station', 'Cutting'),
  ('Laser Marking Station', 'Laser'),
  ('Packaging Station', 'Packaging')
on conflict (machine_name) do nothing;

-- 3. PRODUCTION PARAMETERS
--    Defines how many units of each inventory item are consumed
--    per aligner produced and per case completed.
create table if not exists production_params (
  id uuid primary key default gen_random_uuid(),
  param_name text unique not null,           -- display label
  inventory_item_name text not null,         -- must match inventory_items.name exactly
  value_per_aligner numeric(10,4) default 0, -- consumption per aligner
  value_per_case    numeric(10,4) default 0, -- consumption per case
  unit text,
  description text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Default consumption rules (edit freely in dashboard)
insert into production_params (param_name, inventory_item_name, value_per_aligner, value_per_case, unit, description) values
  ('Resin',              'Resin',              0.01,  0,    'litres',  '100 aligners = 1 litre of resin'),
  ('Packaging Box',      'Packaging Box',      0,     2,    'boxes',   'Each case needs 2 boxes'),
  ('Thermoforming Film', 'Thermoforming Film', 0.02,  0,    'sheets',  'Film sheets per aligner'),
  ('Cleaning Solution',  'Cleaning Solution',  0.005, 0,    'litres',  'IPA/cleaning solution per aligner')
on conflict (param_name) do nothing;

-- 4. PRODUCTION RECORDS
create table if not exists production_records (
  id uuid primary key default gen_random_uuid(),
  order_no text not null,
  batch_id text,
  aligners_count integer not null default 0,
  cases_count integer not null default 0,
  employee_name text,
  notes text,
  auto_requisition_triggered boolean not null default false,
  inventory_deducted boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS and open policies (matching your existing pattern)
alter table employees          enable row level security;
alter table machines           enable row level security;
alter table production_params  enable row level security;
alter table production_records enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='employees' and policyname='employees_all') then
    create policy employees_all on employees for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='machines' and policyname='machines_all') then
    create policy machines_all on machines for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='production_params' and policyname='production_params_all') then
    create policy production_params_all on production_params for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='production_records' and policyname='production_records_all') then
    create policy production_records_all on production_records for all using (true) with check (true);
  end if;
end $$;
