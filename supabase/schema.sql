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

-- ── 10. EXPERIENCE COLUMN + ADVISORY MEMBERS ─────────────────────────────────
alter table team_members add column if not exists experience text;

-- Advisory committee members (run once to migrate from hardcoded)
insert into team_members (name, role, agency, phone, email, bio, experience, accent, sort_order, is_active) values
('Miranda Pierce',       'Detective',                        'CPD',  '916-947-0356', 'miranda.pierce@chicoca.gov',
 'Officer with the Chico Police Department for approximately 6 years. Currently a Detective. My background is in Psychology and Behavioral Analysis. Family comes first with me and I enjoy helping those around me to get home safely to theirs.',
 'In the first 5 years in your career, Experienced a critical incident, Parenting, Divorce, Loss of spouse, Mental health in your family',
 '#1A8A72', 10, true),
('Melody Brown',         'Deputy Chief of Operations & HR',  'BEMS', '530-720-7503', 'Mbrown@bcems.org',
 'I have been in and around EMS since 2004. I started my 911 career with Butte County EMS in 2007 and have been a paramedic since 2008. I worked as a paramedic and field training officer full-time until 2017 when I also took on the role of Health and Safety Officer. After the Camp Fire, I also took on the role of Human Resources and Education. Now I am the Deputy Chief of Operations and HR.',
 'In the first 5 years in your career, Lifelong career (over 15 years), Experienced a critical incident, Mental health in your family, Injury',
 '#2563A8', 11, true),
('Ken Smith',            'Firefighter',                      'CFD',  '530-624-2922', 'ken.smith@chicoca.gov',
 'Been in the fire service 30 years — 26 years with Chico Fire as a volunteer and career Firefighter. I have a true passion for peer support and promoting a positive vibe in the often negative environment that we serve in. My personal goal is to help others have a healthy balance of work and play, while putting family first.',
 'Lifelong career (over 15 years), Experienced a critical incident, Parenting, Finances, Substance use in your family, Mental health in your family, Injury',
 '#C9A84C', 12, true),
('John Nickelson',       'Police Officer',                   'CPD',  '530-720-3744', 'john.nickelson@chicoca.gov',
 'I have been a police officer since February 2012. In my first 4 years, I was involved in 2 shootings, one of which my partner was hit. I became interested in officer wellness due to the care that my fellow colleagues showed me, and from support I received through Butte County Critical Incident Stress Management. My goal is to help others navigate critical incidents during their careers.',
 'Experienced a Critical Incident',
 '#0B1F4A', 13, true),
('Christopher B Nicodemus', 'Officer · LEA Instructor',      'CSPD', '530-570-8743', 'cnicodemus@csuchico.edu',
 'I have been in law enforcement for 22 years and worked for the Oroville Police Department, Butte County Sheriff''s Office, and California State University, Chico Police Department. I also teach at the Butte College Law Enforcement Academy. I have seen firsthand the importance of improving peer support and wellness programs at my agency and those I previously worked for.',
 'Lifelong career (over 15 years), Experienced a critical incident, Experienced an OIS, Parenting',
 '#1A8A72', 14, true),
('Alex Duenas',           'Probation Department',            'BCPD', '916-899-8160', 'aduenas@buttecounty.net',
 'I have worked with the Butte County Probation Department for 11 years and have seen what this type of work can do to us who work in this field. I want everyone to be healthy and well and to be the best version of themselves — healthy not only for those they serve, but most importantly, their families and their life outside of work.',
 'In the first 5 years in your career, Parenting, Finances, Substance use in your family, Mental health in your family, Injury',
 '#2563A8', 15, true)
on conflict do nothing;

-- ── 11. FEEDBACK TABLE ────────────────────────────────────────────────────────
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
