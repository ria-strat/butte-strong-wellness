-- ============================================================
-- BUTTE STRONG WELLNESS — Auth & Profiles Migration
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- Dashboard → SQL Editor → New query → paste → Run
-- ============================================================


-- ── 1. APP SETTINGS (stores access code + future config) ─────
create table if not exists app_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

alter table app_settings enable row level security;
-- No direct public access — read only via security-definer function below

-- Insert the access code.
-- To change it later: UPDATE app_settings SET value = 'NEWCODE' WHERE key = 'access_code';
insert into app_settings (key, value) values ('access_code', 'BUTTE2026')
  on conflict (key) do update set value = excluded.value, updated_at = now();


-- ── 2. VALIDATE ACCESS CODE (callable by unauthenticated users) ──
-- security definer: runs as DB owner, bypassing RLS so it can read app_settings.
-- The anon role can call this without direct table access.
create or replace function validate_access_code(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from app_settings
    where key = 'access_code'
      and upper(trim(value)) = upper(trim(p_code))
  );
end;
$$;

grant execute on function validate_access_code(text) to anon;
grant execute on function validate_access_code(text) to authenticated;


-- ── 3. USER PROFILES (agency + role per user) ─────────────────
create table if not exists user_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  agency     text,
  staff_type text check (staff_type in ('Sworn Staff', 'Civilian Staff', 'Family Member')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_profiles enable row level security;

-- Each user can only read and write their own profile
create policy "Users can read own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

grant select, insert, update on user_profiles to authenticated;
