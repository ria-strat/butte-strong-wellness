-- ============================================================
-- BUTTE STRONG WELLNESS — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- ── 1. PEER SUPPORT MEMBERS ──────────────────────────────────
create table if not exists peer_support_members (
  id            serial primary key,
  name          text not null,
  agency        text,
  phone         text,
  email         text,
  photo_url     text,
  bio           text,
  experience    text,
  is_chaplain   boolean default false,
  sort_order    int default 0,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- ── 2. PHYSICAL FITNESS CATEGORIES ───────────────────────────
create table if not exists fitness_categories (
  id          serial primary key,
  title       text not null,
  description text,
  sort_order  int default 0,
  is_active   boolean default true
);

-- ── 3. PHYSICAL FITNESS ITEMS ─────────────────────────────────
create table if not exists fitness_items (
  id            serial primary key,
  category_id   int references fitness_categories(id) on delete cascade,
  title         text not null,
  item_type     text not null check (item_type in ('location','info','link')),
  content       text,
  description   text,
  address       text,
  hours         text,
  phone         text,
  website       text,
  url           text,
  sort_order    int default 0,
  is_active     boolean default true
);

-- ── 4. THERAPISTS ─────────────────────────────────────────────
create table if not exists therapists (
  id          serial primary key,
  name        text not null,
  title       text,
  phone       text,
  email       text,
  address     text,
  insurance   text,
  bio         text,
  quote       text,
  sort_order  int default 0,
  is_active   boolean default true
);

-- ── 5. TEAM MEMBERS (About page) ──────────────────────────────
create table if not exists team_members (
  id          serial primary key,
  name        text not null,
  role        text,
  agency      text,
  email       text,
  phone       text,
  bio         text,
  photo_url   text,
  accent      text default '#C9A84C',
  sort_order  int default 0,
  is_active   boolean default true
);

-- ── 6. CRISIS CONTACTS (Get Help Now) ─────────────────────────
create table if not exists crisis_contacts (
  id          serial primary key,
  name        text not null,
  phone       text,
  description text,
  sort_order  int default 0,
  is_active   boolean default true
);

-- ── 7. NEWS & EVENTS ──────────────────────────────────────────
create table if not exists events (
  id                serial primary key,
  title             text not null,
  event_date        date,
  event_time        text,
  location          text,
  description       text,
  registration_url  text,
  cover_image_url   text,
  is_active         boolean default true,
  created_at        timestamptz default now()
);

-- ── 8. ROW LEVEL SECURITY ─────────────────────────────────────
-- Enable RLS on all tables
alter table peer_support_members enable row level security;
alter table fitness_categories   enable row level security;
alter table fitness_items        enable row level security;
alter table therapists           enable row level security;
alter table team_members         enable row level security;
alter table crisis_contacts      enable row level security;
alter table events               enable row level security;

-- Public can read active records (anon key access for the app)
create policy "Public read peer_support_members"
  on peer_support_members for select
  using (is_active = true);

create policy "Public read fitness_categories"
  on fitness_categories for select
  using (is_active = true);

create policy "Public read fitness_items"
  on fitness_items for select
  using (is_active = true);

create policy "Public read therapists"
  on therapists for select
  using (is_active = true);

create policy "Public read team_members"
  on team_members for select
  using (is_active = true);

create policy "Public read crisis_contacts"
  on crisis_contacts for select
  using (is_active = true);

create policy "Public read events"
  on events for select
  using (is_active = true);

-- Authenticated admins can do everything
create policy "Admin full access peer_support_members"
  on peer_support_members for all
  using (auth.role() = 'authenticated');

create policy "Admin full access fitness_categories"
  on fitness_categories for all
  using (auth.role() = 'authenticated');

create policy "Admin full access fitness_items"
  on fitness_items for all
  using (auth.role() = 'authenticated');

create policy "Admin full access therapists"
  on therapists for all
  using (auth.role() = 'authenticated');

create policy "Admin full access team_members"
  on team_members for all
  using (auth.role() = 'authenticated');

create policy "Admin full access crisis_contacts"
  on crisis_contacts for all
  using (auth.role() = 'authenticated');

create policy "Admin full access events"
  on events for all
  using (auth.role() = 'authenticated');

-- ── 9. TABLE-LEVEL GRANTS ─────────────────────────────────────────────────
-- RLS controls which rows; grants control which tables. Both are required.
grant select on peer_support_members to anon;
grant select on fitness_categories   to anon;
grant select on fitness_items        to anon;
grant select on therapists           to anon;
grant select on team_members         to anon;
grant select on crisis_contacts      to anon;
grant select on events               to anon;

grant all on peer_support_members to authenticated;
grant all on fitness_categories   to authenticated;
grant all on fitness_items        to authenticated;
grant all on therapists           to authenticated;
grant all on team_members         to authenticated;
grant all on crisis_contacts      to authenticated;
grant all on events               to authenticated;

grant usage, select on all sequences in schema public to authenticated;

-- ── 10. FEEDBACK TABLE ────────────────────────────────────────────────────────
create table if not exists feedback (
  id         serial primary key,
  name       text,
  agency     text,
  message    text not null,
  is_read    boolean default false,
  created_at timestamptz default now()
);

alter table feedback enable row level security;

create policy "Anyone can submit feedback"
  on feedback for insert
  with check (true);

create policy "Admin can read feedback"
  on feedback for select
  using (auth.role() = 'authenticated');

create policy "Admin can update feedback"
  on feedback for update
  using (auth.role() = 'authenticated');

create policy "Admin can delete feedback"
  on feedback for delete
  using (auth.role() = 'authenticated');

grant insert                    on feedback           to anon;
grant select, update, delete    on feedback           to authenticated;
grant usage, select             on sequence feedback_id_seq to anon;
grant usage, select             on sequence feedback_id_seq to authenticated;

-- ── 11. STORAGE BUCKET + POLICIES (photos) ────────────────────────────────────
-- Creates the bucket if it doesn't exist yet
insert into storage.buckets (id, name, public)
  values ('photos', 'photos', true)
  on conflict (id) do nothing;

-- Anyone can view photos (public bucket)
create policy "Public can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');

-- Authenticated admins can upload
create policy "Authenticated can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');

-- Authenticated admins can replace/update
create policy "Authenticated can update photos"
  on storage.objects for update
  using (bucket_id = 'photos' and auth.role() = 'authenticated');

-- Authenticated admins can delete
create policy "Authenticated can delete photos"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.role() = 'authenticated');
