create or replace function public.derive_profile_display_name(
  user_email text,
  user_metadata jsonb default '{}'::jsonb
)
returns text
language sql
stable
as $$
  select coalesce(
    nullif(trim(user_metadata ->> 'display_name'), ''),
    nullif(trim(user_metadata ->> 'full_name'), ''),
    nullif(trim(user_metadata ->> 'name'), ''),
    nullif(trim(split_part(coalesce(user_email, ''), '@', 1)), ''),
    'Member'
  );
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  derived_timezone text := nullif(trim(profile_metadata ->> 'timezone'), '');
begin
  insert into public.profiles (
    id,
    display_name,
    timezone
  )
  values (
    new.id,
    public.derive_profile_display_name(new.email, profile_metadata),
    coalesce(derived_timezone, 'UTC')
  )
  on conflict (id) do update
  set
    display_name = excluded.display_name,
    timezone = excluded.timezone;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

insert into public.profiles (
  id,
  display_name,
  timezone
)
select
  users.id,
  public.derive_profile_display_name(users.email, coalesce(users.raw_user_meta_data, '{}'::jsonb)),
  coalesce(nullif(trim(coalesce(users.raw_user_meta_data, '{}'::jsonb) ->> 'timezone'), ''), 'UTC')
from auth.users as users
left join public.profiles as profiles
  on profiles.id = users.id
where profiles.id is null;
