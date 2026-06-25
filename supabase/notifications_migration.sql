-- ============================================================
-- BUTTE STRONG WELLNESS — Notifications Migration
-- Run in Supabase SQL Editor after auth_profiles_migration.sql
-- ============================================================


-- ── 1. STORE ONESIGNAL CREDENTIALS IN app_settings ───────────
-- After you have your OneSignal App ID and REST API Key, run:
--   UPDATE app_settings SET value = 'your-app-id'  WHERE key = 'onesignal_app_id';
--   UPDATE app_settings SET value = 'your-api-key' WHERE key = 'onesignal_api_key';
-- Or insert them fresh:
insert into app_settings (key, value) values
  ('onesignal_app_id',  'PASTE_APP_ID_HERE'),
  ('onesignal_api_key', 'PASTE_API_KEY_HERE')
on conflict (key) do update set value = excluded.value, updated_at = now();


-- ── 2. ADMIN-ONLY FUNCTION TO RETRIEVE A SETTING ─────────────
-- Only returns a value if the calling user is in the admins table.
-- security definer: runs as DB owner so it can read app_settings.
create or replace function get_setting_for_admin(p_key text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_value text;
begin
  -- Verify the caller is a registered admin
  if not exists (
    select 1 from admins where user_id = auth.uid()
  ) then
    raise exception 'Access denied';
  end if;

  select value into v_value from app_settings where key = p_key;
  return v_value;
end;
$$;

grant execute on function get_setting_for_admin(text) to authenticated;


-- ── 3. NOTIFICATION LOG ───────────────────────────────────────
create table if not exists notification_log (
  id            serial primary key,
  sent_at       timestamptz default now(),
  title         text not null,
  message       text not null,
  target_agency text,    -- null = all agencies
  target_role   text,    -- null = all roles
  sent_by       uuid references auth.users(id)
);

alter table notification_log enable row level security;

create policy "Admins can manage notification log"
  on notification_log for all
  using (auth.role() = 'authenticated');

grant select, insert on notification_log to authenticated;
grant usage, select on sequence notification_log_id_seq to authenticated;
