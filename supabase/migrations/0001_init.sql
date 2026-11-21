-- CranioCare initial schema
-- Run in Supabase SQL editor or via Supabase CLI migrations.

create extension if not exists "pgcrypto";

-- ---------- enums ----------
create type user_role as enum ('admin', 'doctor', 'technician', 'staff');
create type helmet_status as enum ('designed', 'in_production', 'fitted', 'delivered', 'adjusted');
create type appointment_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');

-- ---------- profiles (app users, mirrors auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role user_role not null default 'staff',
  created_at timestamptz not null default now()
);

-- ---------- patients ----------
create table public.patients (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,               -- clinic patient code, e.g. CC-2026-001
  full_name text not null,
  date_of_birth date not null,
  gender text check (gender in ('male', 'female')),
  guardian_name text,
  guardian_phone text,
  address text,
  intake_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- assessments (one row per visit measurement) ----------
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  assessed_at date not null default current_date,
  head_circumference_mm numeric(6, 1),
  cephalic_index numeric(5, 2),            -- CI = width / length * 100
  cvai numeric(5, 2),                      -- cranial vault asymmetry index (%)
  diagnosis text,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ---------- 3D scans ----------
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  assessment_id uuid references public.assessments (id) on delete set null,
  scan_date date not null default current_date,
  scanner_model text,                      -- e.g. Artec EVA
  file_path text,                          -- path inside Supabase Storage bucket "scans"
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- helmets ----------
create table public.helmets (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  ordered_at date not null default current_date,
  size text,
  status helmet_status not null default 'designed',
  delivered_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- appointments ----------
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  scheduled_at timestamptz not null,
  type text,                               -- intake / fitting / follow-up / adjustment
  status appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- indexes ----------
create index idx_assessments_patient on public.assessments (patient_id, assessed_at);
create index idx_scans_patient on public.scans (patient_id, scan_date);
create index idx_helmets_patient on public.helmets (patient_id);
create index idx_appointments_patient on public.appointments (patient_id, scheduled_at);

-- ---------- row level security ----------
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.assessments enable row level security;
alter table public.scans enable row level security;
alter table public.helmets enable row level security;
alter table public.appointments enable row level security;

-- Starter policies: any authenticated clinic user can work with clinical
-- records. Tighten per-role (doctor/technician/staff) in a later migration.
create policy "authenticated full access" on public.patients
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.assessments
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.scans
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.helmets
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.appointments
  for all to authenticated using (true) with check (true);
create policy "own profile" on public.profiles
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
