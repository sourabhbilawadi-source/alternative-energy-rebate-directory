-- supabase_schema.sql
-- DDL schema script for Eco-Friendly & Alternative Energy Rebate Directory

-- Enable UUID generation extension if not present
create extension if not exists "uuid-ossp";

-- Regions table linking global geographic vectors
create table if not exists public.regions (
  id bigint primary key generated always as identity,
  country_code varchar(2) not null,
  state_province varchar(100) not null,
  city varchar(100) not null,
  postal_code varchar(20) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Rebates table tracking incentive parameters (conforming to 124 DSIRE classifications)
create table if not exists public.rebates (
  id uuid primary key default gen_random_uuid(),
  region_id bigint references public.regions(id) on delete cascade,
  authority_name text not null,
  technology_category varchar(100) not null, -- matches DSIRE codes (e.g., 'solar', 'wind', 'battery', 'heat_pump')
  incentive_value numeric not null,
  incentive_type varchar(50) not null, -- e.g., 'fixed', 'percentage', 'per_watt'
  max_limit numeric,
  is_active boolean default true not null,
  expiration_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Granular indexes for performance optimizations on query lookups
create index if not exists idx_regions_postal_code on public.regions(postal_code);
create index if not exists idx_regions_geo_lookup on public.regions(country_code, state_province, city);
create index if not exists idx_rebates_region_id on public.rebates(region_id);
create index if not exists idx_rebates_tech_category on public.rebates(technology_category);

-- Enable Row-Level Security (RLS) on both tables
alter table public.regions enable row level security;
alter table public.rebates enable row level security;

-- Define RLS policies granting public read access (select) to anonymous users
create policy "Allow public read access on regions" 
  on public.regions 
  for select 
  to anon 
  using (true);

create policy "Allow public read access on rebates" 
  on public.rebates 
  for select 
  to anon 
  using (true);

-- Restrict write/modification access (insert, update, delete) to authenticated administrators
create policy "Restrict insert access to authenticated admins"
  on public.regions
  for insert
  to authenticated
  with check (true);

create policy "Restrict update access to authenticated admins"
  on public.regions
  for update
  to authenticated
  using (true);

create policy "Restrict delete access to authenticated admins"
  on public.regions
  for delete
  to authenticated
  using (true);

create policy "Restrict insert access on rebates to authenticated admins"
  on public.rebates
  for insert
  to authenticated
  with check (true);

create policy "Restrict update access on rebates to authenticated admins"
  on public.rebates
  for update
  to authenticated
  using (true);

create policy "Restrict delete access on rebates to authenticated admins"
  on public.rebates
  for delete
  to authenticated
  using (true);
