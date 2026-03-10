create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.app_role as enum ('member', 'founder_admin');
create type public.account_state as enum (
  'waitlisted',
  'invited',
  'active',
  'paused',
  'refunded',
  'alumni',
  'banned'
);
create type public.enrollment_state as enum (
  'waitlist',
  'checkout_started',
  'paid',
  'onboarding',
  'in_program',
  'completed'
);
create type public.task_status as enum ('planned', 'completed', 'missed', 'skipped');
create type public.proof_type as enum ('metric', 'note', 'link', 'image');
create type public.proof_visibility as enum ('private', 'public_opt_in');
create type public.review_status as enum ('draft', 'submitted', 'missed', 'locked');
create type public.notification_type as enum (
  'welcome',
  'onboarding_complete',
  'daily_reminder',
  'missed_day_followup',
  'weekly_review_due',
  'level_unlocked',
  'founder_broadcast',
  'payment_update'
);
create type public.notification_status as enum ('queued', 'sent', 'failed');
create type public.payment_status as enum ('pending', 'paid', 'refunded', 'failed');
create type public.lead_state as enum ('new', 'notified', 'converted', 'unsubscribed');
create type public.progress_decision_source as enum (
  'automatic',
  'admin_override',
  'admin_block'
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'member',
  display_name text not null,
  handle text unique,
  avatar_path text,
  bio text,
  timezone text not null default 'UTC',
  public_profile_enabled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.member_status_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  from_state public.account_state,
  to_state public.account_state not null,
  reason text,
  changed_by uuid references public.profiles (id) on delete set null,
  changed_at timestamptz not null default timezone('utc', now())
);

create table public.waitlist_leads (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  full_name text,
  lead_state public.lead_state not null default 'new',
  source text,
  medium text,
  campaign text,
  referral_code text,
  referred_by_lead_id uuid references public.waitlist_leads (id) on delete set null,
  converted_profile_id uuid references public.profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  duration_days integer not null default 180,
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.levels (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  position integer not null,
  slug text not null,
  title text not null,
  tagline text,
  start_day integer not null,
  end_day integer not null,
  summary text,
  is_final_level boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (program_id, position),
  unique (program_id, slug),
  check (start_day <= end_day)
);

create table public.program_weeks (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  level_id uuid not null references public.levels (id) on delete cascade,
  week_number integer not null,
  start_day integer not null,
  end_day integer not null,
  title text not null,
  theme text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (program_id, week_number)
);

create table public.daily_task_templates (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  level_id uuid not null references public.levels (id) on delete cascade,
  program_week_id uuid references public.program_weeks (id) on delete set null,
  day_offset integer,
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_required boolean not null default true,
  proof_required boolean not null default false,
  proof_type_hint public.proof_type,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.weekly_mission_templates (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  level_id uuid not null references public.levels (id) on delete cascade,
  program_week_id uuid not null references public.program_weeks (id) on delete cascade,
  title text not null,
  instructions text not null,
  success_criteria text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  name text not null,
  slug text not null unique,
  starts_on date not null,
  ends_on date,
  enrollment_opens_at timestamptz,
  enrollment_closes_at timestamptz,
  status text not null default 'planned',
  external_community_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.member_programs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  active_cohort_id uuid references public.cohorts (id) on delete set null,
  account_state public.account_state not null default 'waitlisted',
  enrollment_state public.enrollment_state not null default 'waitlist',
  start_date date,
  activated_at timestamptz,
  completed_at timestamptz,
  current_day integer not null default 0,
  current_level_id uuid references public.levels (id) on delete set null,
  primary_goal text,
  secondary_goals jsonb not null default '[]'::jsonb,
  rules_accepted_at timestamptz,
  baseline_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (profile_id, program_id)
);

create table public.cohort_memberships (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  member_program_id uuid references public.member_programs (id) on delete set null,
  joined_at timestamptz not null default timezone('utc', now()),
  left_at timestamptz
);

create table public.member_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  daily_reminder_enabled boolean not null default true,
  daily_reminder_time time,
  weekly_review_reminder_enabled boolean not null default true,
  timezone text not null default 'UTC',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.member_daily_tasks (
  id uuid primary key default gen_random_uuid(),
  member_program_id uuid not null references public.member_programs (id) on delete cascade,
  daily_task_template_id uuid references public.daily_task_templates (id) on delete set null,
  level_id uuid not null references public.levels (id) on delete cascade,
  program_week_id uuid references public.program_weeks (id) on delete set null,
  due_date date not null,
  title text not null,
  description text,
  status public.task_status not null default 'planned',
  completed_at timestamptz,
  skipped_at timestamptz,
  missed_at timestamptz,
  proof_required boolean not null default false,
  same_day_editable_until timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (member_program_id, daily_task_template_id, due_date)
);

create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  member_program_id uuid not null references public.member_programs (id) on delete cascade,
  checkin_date date not null,
  status public.review_status not null default 'draft',
  summary text,
  wins jsonb not null default '[]'::jsonb,
  misses jsonb not null default '[]'::jsonb,
  lessons jsonb not null default '[]'::jsonb,
  submitted_at timestamptz,
  locked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (member_program_id, checkin_date)
);

create table public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  member_program_id uuid not null references public.member_programs (id) on delete cascade,
  program_week_id uuid not null references public.program_weeks (id) on delete cascade,
  weekly_mission_template_id uuid references public.weekly_mission_templates (id) on delete set null,
  status public.review_status not null default 'draft',
  summary text,
  wins jsonb not null default '[]'::jsonb,
  misses jsonb not null default '[]'::jsonb,
  lessons jsonb not null default '[]'::jsonb,
  next_week_adjustments jsonb not null default '[]'::jsonb,
  score integer,
  due_at timestamptz,
  submitted_at timestamptz,
  locked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (member_program_id, program_week_id)
);

create table public.monthly_reviews (
  id uuid primary key default gen_random_uuid(),
  member_program_id uuid not null references public.member_programs (id) on delete cascade,
  level_id uuid not null references public.levels (id) on delete cascade,
  status public.review_status not null default 'draft',
  summary text,
  wins jsonb not null default '[]'::jsonb,
  misses jsonb not null default '[]'::jsonb,
  lessons jsonb not null default '[]'::jsonb,
  reflection jsonb not null default '{}'::jsonb,
  due_at timestamptz,
  submitted_at timestamptz,
  locked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (member_program_id, level_id)
);

create table public.proof_items (
  id uuid primary key default gen_random_uuid(),
  member_program_id uuid not null references public.member_programs (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  member_daily_task_id uuid references public.member_daily_tasks (id) on delete set null,
  daily_checkin_id uuid references public.daily_checkins (id) on delete set null,
  weekly_review_id uuid references public.weekly_reviews (id) on delete set null,
  monthly_review_id uuid references public.monthly_reviews (id) on delete set null,
  type public.proof_type not null,
  visibility public.proof_visibility not null default 'private',
  label text not null,
  text_value text,
  numeric_value numeric,
  url text,
  storage_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    member_daily_task_id is not null
    or daily_checkin_id is not null
    or weekly_review_id is not null
    or monthly_review_id is not null
  )
);

create table public.level_unlock_rules (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null unique references public.levels (id) on delete cascade,
  minimum_completed_days integer not null default 0,
  minimum_weekly_reviews_submitted integer not null default 0,
  monthly_review_required boolean not null default true,
  maximum_missed_days integer,
  minimum_proof_items integer not null default 0,
  requires_founder_approval boolean not null default false,
  grace_days integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.level_progress (
  id uuid primary key default gen_random_uuid(),
  member_program_id uuid not null references public.member_programs (id) on delete cascade,
  level_id uuid not null references public.levels (id) on delete cascade,
  decision_source public.progress_decision_source not null,
  eligible boolean not null,
  evaluation_started_on date not null,
  evaluation_ended_on date not null,
  metrics_snapshot jsonb not null default '{}'::jsonb,
  decision_reason text,
  decided_by uuid references public.profiles (id) on delete set null,
  unlocked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs (id) on delete set null,
  cohort_id uuid references public.cohorts (id) on delete set null,
  title text not null,
  body text not null,
  published_at timestamptz,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.founder_updates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  summary text,
  body text not null,
  visibility public.proof_visibility not null default 'public_opt_in',
  x_post_url text,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  member_program_id uuid references public.member_programs (id) on delete set null,
  stripe_customer_id text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  payment_status public.payment_status not null default 'pending',
  paid_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  member_program_id uuid references public.member_programs (id) on delete set null,
  source text not null,
  access_granted boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  revoked_at timestamptz,
  reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.notification_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  member_program_id uuid references public.member_programs (id) on delete set null,
  type public.notification_type not null,
  status public.notification_status not null default 'queued',
  provider text not null default 'resend',
  provider_message_id text,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_profile_id uuid not null references public.profiles (id) on delete cascade,
  referred_email citext,
  referred_profile_id uuid references public.profiles (id) on delete set null,
  code text not null unique,
  converted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index idx_member_status_history_profile_id on public.member_status_history (profile_id);
create index idx_waitlist_leads_converted_profile_id on public.waitlist_leads (converted_profile_id);
create index idx_levels_program_id on public.levels (program_id);
create index idx_program_weeks_level_id on public.program_weeks (level_id);
create index idx_daily_task_templates_level_id on public.daily_task_templates (level_id);
create index idx_weekly_mission_templates_week_id on public.weekly_mission_templates (program_week_id);
create index idx_cohorts_program_id on public.cohorts (program_id);
create index idx_member_programs_profile_id on public.member_programs (profile_id);
create index idx_member_programs_program_id on public.member_programs (program_id);
create index idx_member_programs_current_level_id on public.member_programs (current_level_id);
create index idx_cohort_memberships_profile_id on public.cohort_memberships (profile_id);
create index idx_member_daily_tasks_member_program_id on public.member_daily_tasks (member_program_id);
create index idx_member_daily_tasks_due_date on public.member_daily_tasks (due_date);
create index idx_daily_checkins_member_program_id on public.daily_checkins (member_program_id);
create index idx_weekly_reviews_member_program_id on public.weekly_reviews (member_program_id);
create index idx_monthly_reviews_member_program_id on public.monthly_reviews (member_program_id);
create index idx_proof_items_member_program_id on public.proof_items (member_program_id);
create index idx_proof_items_profile_id on public.proof_items (profile_id);
create index idx_level_progress_member_program_id on public.level_progress (member_program_id);
create index idx_announcements_program_id on public.announcements (program_id);
create index idx_founder_updates_profile_id on public.founder_updates (profile_id);
create index idx_payments_profile_id on public.payments (profile_id);
create index idx_entitlements_profile_id on public.entitlements (profile_id);
create index idx_notification_events_profile_id on public.notification_events (profile_id);
create index idx_referrals_referrer_profile_id on public.referrals (referrer_profile_id);

create trigger handle_profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();
create trigger handle_waitlist_leads_updated_at
before update on public.waitlist_leads
for each row execute function public.handle_updated_at();
create trigger handle_programs_updated_at
before update on public.programs
for each row execute function public.handle_updated_at();
create trigger handle_levels_updated_at
before update on public.levels
for each row execute function public.handle_updated_at();
create trigger handle_program_weeks_updated_at
before update on public.program_weeks
for each row execute function public.handle_updated_at();
create trigger handle_daily_task_templates_updated_at
before update on public.daily_task_templates
for each row execute function public.handle_updated_at();
create trigger handle_weekly_mission_templates_updated_at
before update on public.weekly_mission_templates
for each row execute function public.handle_updated_at();
create trigger handle_cohorts_updated_at
before update on public.cohorts
for each row execute function public.handle_updated_at();
create trigger handle_member_programs_updated_at
before update on public.member_programs
for each row execute function public.handle_updated_at();
create trigger handle_member_notification_preferences_updated_at
before update on public.member_notification_preferences
for each row execute function public.handle_updated_at();
create trigger handle_member_daily_tasks_updated_at
before update on public.member_daily_tasks
for each row execute function public.handle_updated_at();
create trigger handle_daily_checkins_updated_at
before update on public.daily_checkins
for each row execute function public.handle_updated_at();
create trigger handle_weekly_reviews_updated_at
before update on public.weekly_reviews
for each row execute function public.handle_updated_at();
create trigger handle_monthly_reviews_updated_at
before update on public.monthly_reviews
for each row execute function public.handle_updated_at();
create trigger handle_proof_items_updated_at
before update on public.proof_items
for each row execute function public.handle_updated_at();
create trigger handle_level_unlock_rules_updated_at
before update on public.level_unlock_rules
for each row execute function public.handle_updated_at();
create trigger handle_level_progress_updated_at
before update on public.level_progress
for each row execute function public.handle_updated_at();
create trigger handle_announcements_updated_at
before update on public.announcements
for each row execute function public.handle_updated_at();
create trigger handle_founder_updates_updated_at
before update on public.founder_updates
for each row execute function public.handle_updated_at();
create trigger handle_payments_updated_at
before update on public.payments
for each row execute function public.handle_updated_at();
create trigger handle_entitlements_updated_at
before update on public.entitlements
for each row execute function public.handle_updated_at();
create trigger handle_notification_events_updated_at
before update on public.notification_events
for each row execute function public.handle_updated_at();
create trigger handle_referrals_updated_at
before update on public.referrals
for each row execute function public.handle_updated_at();

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

create or replace function public.is_founder_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'founder_admin', false)
$$;

alter table public.profiles enable row level security;
alter table public.member_status_history enable row level security;
alter table public.waitlist_leads enable row level security;
alter table public.programs enable row level security;
alter table public.levels enable row level security;
alter table public.program_weeks enable row level security;
alter table public.daily_task_templates enable row level security;
alter table public.weekly_mission_templates enable row level security;
alter table public.cohorts enable row level security;
alter table public.member_programs enable row level security;
alter table public.cohort_memberships enable row level security;
alter table public.member_notification_preferences enable row level security;
alter table public.member_daily_tasks enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.monthly_reviews enable row level security;
alter table public.proof_items enable row level security;
alter table public.level_unlock_rules enable row level security;
alter table public.level_progress enable row level security;
alter table public.announcements enable row level security;
alter table public.founder_updates enable row level security;
alter table public.payments enable row level security;
alter table public.entitlements enable row level security;
alter table public.notification_events enable row level security;
alter table public.referrals enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (id = auth.uid() or public.is_founder_admin());

create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (id = auth.uid() or public.is_founder_admin())
with check (id = auth.uid() or public.is_founder_admin());

create policy "programs_select_public"
on public.programs
for select
using (true);

create policy "levels_select_public"
on public.levels
for select
using (true);

create policy "program_weeks_select_public"
on public.program_weeks
for select
using (true);

create policy "daily_task_templates_select_public"
on public.daily_task_templates
for select
using (true);

create policy "weekly_mission_templates_select_authenticated_or_admin"
on public.weekly_mission_templates
for select
using (auth.uid() is not null or public.is_founder_admin());

create policy "cohorts_select_authenticated_or_admin"
on public.cohorts
for select
using (auth.uid() is not null or public.is_founder_admin());

create policy "member_programs_select_own_or_admin"
on public.member_programs
for select
using (profile_id = auth.uid() or public.is_founder_admin());

create policy "member_notification_preferences_select_own_or_admin"
on public.member_notification_preferences
for select
using (profile_id = auth.uid() or public.is_founder_admin());

create policy "member_notification_preferences_update_own_or_admin"
on public.member_notification_preferences
for update
using (profile_id = auth.uid() or public.is_founder_admin())
with check (profile_id = auth.uid() or public.is_founder_admin());

create policy "member_daily_tasks_select_own_or_admin"
on public.member_daily_tasks
for select
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "member_daily_tasks_update_own_or_admin"
on public.member_daily_tasks
for update
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
)
with check (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "daily_checkins_select_own_or_admin"
on public.daily_checkins
for select
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "daily_checkins_insert_own_or_admin"
on public.daily_checkins
for insert
with check (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "daily_checkins_update_own_or_admin"
on public.daily_checkins
for update
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
)
with check (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "weekly_reviews_select_own_or_admin"
on public.weekly_reviews
for select
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "weekly_reviews_insert_own_or_admin"
on public.weekly_reviews
for insert
with check (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "weekly_reviews_update_own_or_admin"
on public.weekly_reviews
for update
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
)
with check (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "monthly_reviews_select_own_or_admin"
on public.monthly_reviews
for select
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "monthly_reviews_insert_own_or_admin"
on public.monthly_reviews
for insert
with check (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "monthly_reviews_update_own_or_admin"
on public.monthly_reviews
for update
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
)
with check (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "proof_items_select_owner_admin_or_public"
on public.proof_items
for select
using (
  public.is_founder_admin()
  or profile_id = auth.uid()
  or (
    visibility = 'public_opt_in'
    and exists (
      select 1
      from public.profiles p
      where p.id = profile_id
        and p.public_profile_enabled = true
    )
  )
);

create policy "proof_items_insert_own_or_admin"
on public.proof_items
for insert
with check (profile_id = auth.uid() or public.is_founder_admin());

create policy "proof_items_update_own_or_admin"
on public.proof_items
for update
using (profile_id = auth.uid() or public.is_founder_admin())
with check (profile_id = auth.uid() or public.is_founder_admin());

create policy "level_unlock_rules_select_authenticated_or_admin"
on public.level_unlock_rules
for select
using (auth.uid() is not null or public.is_founder_admin());

create policy "level_progress_select_own_or_admin"
on public.level_progress
for select
using (
  public.is_founder_admin()
  or exists (
    select 1
    from public.member_programs mp
    where mp.id = member_program_id
      and mp.profile_id = auth.uid()
  )
);

create policy "announcements_select_published_or_admin"
on public.announcements
for select
using (published_at is not null or public.is_founder_admin());

create policy "founder_updates_select_published_or_admin"
on public.founder_updates
for select
using (published_at is not null or public.is_founder_admin());

create policy "entitlements_select_own_or_admin"
on public.entitlements
for select
using (profile_id = auth.uid() or public.is_founder_admin());

create policy "payments_select_own_or_admin"
on public.payments
for select
using (profile_id = auth.uid() or public.is_founder_admin());

create or replace view public.public_proof_items_v
with (security_invoker = true) as
select
  pi.id,
  pi.profile_id,
  p.display_name,
  p.handle,
  pi.type,
  pi.label,
  pi.text_value,
  pi.numeric_value,
  pi.url,
  pi.storage_path,
  pi.created_at
from public.proof_items pi
join public.profiles p on p.id = pi.profile_id
where pi.visibility = 'public_opt_in'
  and p.public_profile_enabled = true;

create or replace view public.founder_journey_feed_v
with (security_invoker = true) as
select
  dc.id,
  mp.profile_id,
  'daily'::text as entry_type,
  dc.checkin_date::timestamptz as entry_at,
  coalesce(dc.summary, '') as summary,
  jsonb_build_object(
    'wins', dc.wins,
    'misses', dc.misses,
    'lessons', dc.lessons
  ) as payload
from public.daily_checkins dc
join public.member_programs mp on mp.id = dc.member_program_id
join public.profiles p on p.id = mp.profile_id
where p.role = 'founder_admin'
  and dc.status = 'submitted'
union all
select
  wr.id,
  mp.profile_id,
  'weekly'::text as entry_type,
  coalesce(wr.submitted_at, wr.created_at) as entry_at,
  coalesce(wr.summary, '') as summary,
  jsonb_build_object(
    'wins', wr.wins,
    'misses', wr.misses,
    'lessons', wr.lessons,
    'nextWeekAdjustments', wr.next_week_adjustments
  ) as payload
from public.weekly_reviews wr
join public.member_programs mp on mp.id = wr.member_program_id
join public.profiles p on p.id = mp.profile_id
where p.role = 'founder_admin'
  and wr.status = 'submitted'
union all
select
  mr.id,
  mp.profile_id,
  'monthly'::text as entry_type,
  coalesce(mr.submitted_at, mr.created_at) as entry_at,
  coalesce(mr.summary, '') as summary,
  jsonb_build_object(
    'wins', mr.wins,
    'misses', mr.misses,
    'lessons', mr.lessons,
    'reflection', mr.reflection
  ) as payload
from public.monthly_reviews mr
join public.member_programs mp on mp.id = mr.member_program_id
join public.profiles p on p.id = mp.profile_id
where p.role = 'founder_admin'
  and mr.status = 'submitted'
union all
select
  fu.id,
  fu.profile_id,
  'founder_update'::text as entry_type,
  coalesce(fu.published_at, fu.created_at) as entry_at,
  coalesce(fu.summary, fu.title) as summary,
  jsonb_build_object(
    'title', fu.title,
    'body', fu.body,
    'xPostUrl', fu.x_post_url
  ) as payload
from public.founder_updates fu
join public.profiles p on p.id = fu.profile_id
where p.role = 'founder_admin'
  and fu.published_at is not null;
