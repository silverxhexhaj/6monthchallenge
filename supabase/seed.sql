insert into public.programs (slug, title, description, duration_days, status)
values (
  '6-month-challenge',
  '6-Month Challenge',
  'A 180-day execution and accountability system built around six levels of transformation.',
  180,
  'active'
)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  duration_days = excluded.duration_days,
  status = excluded.status;

with program as (
  select id
  from public.programs
  where slug = '6-month-challenge'
)
insert into public.levels (
  program_id,
  position,
  slug,
  title,
  tagline,
  start_day,
  end_day,
  summary,
  is_final_level
)
select
  program.id,
  level_data.position,
  level_data.slug,
  level_data.title,
  level_data.tagline,
  level_data.start_day,
  level_data.end_day,
  level_data.summary,
  level_data.is_final_level
from program
cross join (
  values
    (
      1,
      'command-time',
      'Command Time',
      'Foundation And Time Control',
      1,
      30,
      'Lock in the daily structure, fixed wake time, and ruthless time ownership.',
      false
    ),
    (
      2,
      'forge-discipline',
      'Forge Discipline',
      'Make Action Non-Negotiable',
      31,
      60,
      'Replace emotional decision-making with consistent, non-negotiable action.',
      false
    ),
    (
      3,
      'raise-standards',
      'Raise Standards',
      'Increase The Bar',
      61,
      90,
      'Push beyond average, tighten weak points, and raise the quality of execution.',
      false
    ),
    (
      4,
      'build-a-fortress-mind',
      'Build a Fortress Mind',
      'Mental Resilience',
      91,
      120,
      'Build emotional control, environmental discipline, and a stronger response to resistance.',
      false
    ),
    (
      5,
      'execute-without-mercy',
      'Execute Without Mercy',
      'Full Acceleration',
      121,
      150,
      'Operate with urgency and sustain high-output execution without hesitation.',
      false
    ),
    (
      6,
      'become-unstoppable',
      'Become Unstoppable',
      'Integration And Completion',
      151,
      180,
      'Integrate the full operating system, finish the challenge, and package the proof of transformation.',
      true
    )
) as level_data(position, slug, title, tagline, start_day, end_day, summary, is_final_level)
on conflict (program_id, position) do update
set
  slug = excluded.slug,
  title = excluded.title,
  tagline = excluded.tagline,
  start_day = excluded.start_day,
  end_day = excluded.end_day,
  summary = excluded.summary,
  is_final_level = excluded.is_final_level;

with program as (
  select id
  from public.programs
  where slug = '6-month-challenge'
),
weeks as (
  select
    generate_series(1, 26) as week_number
)
insert into public.program_weeks (
  program_id,
  level_id,
  week_number,
  start_day,
  end_day,
  title,
  theme
)
select
  program.id,
  levels.id,
  weeks.week_number,
  ((weeks.week_number - 1) * 7) + 1,
  least(weeks.week_number * 7, 180),
  'Week ' || weeks.week_number,
  levels.title
from program
join weeks on true
join public.levels levels
  on levels.program_id = program.id
 and levels.position = case
   when weeks.week_number between 1 and 4 then 1
   when weeks.week_number between 5 and 8 then 2
   when weeks.week_number between 9 and 13 then 3
   when weeks.week_number between 14 and 17 then 4
   when weeks.week_number between 18 and 21 then 5
   else 6
 end
on conflict (program_id, week_number) do update
set
  level_id = excluded.level_id,
  start_day = excluded.start_day,
  end_day = excluded.end_day,
  title = excluded.title,
  theme = excluded.theme;

with level_rules as (
  select
    l.id as level_id,
    l.position
  from public.levels l
  join public.programs p on p.id = l.program_id
  where p.slug = '6-month-challenge'
)
insert into public.level_unlock_rules (
  level_id,
  minimum_completed_days,
  minimum_weekly_reviews_submitted,
  monthly_review_required,
  maximum_missed_days,
  minimum_proof_items,
  requires_founder_approval,
  grace_days
)
select
  level_rules.level_id,
  case when level_rules.position = 6 then 26 else 24 end,
  case when level_rules.position = 6 then 4 else 4 end,
  true,
  6,
  0,
  false,
  3
from level_rules
on conflict (level_id) do update
set
  minimum_completed_days = excluded.minimum_completed_days,
  minimum_weekly_reviews_submitted = excluded.minimum_weekly_reviews_submitted,
  monthly_review_required = excluded.monthly_review_required,
  maximum_missed_days = excluded.maximum_missed_days,
  minimum_proof_items = excluded.minimum_proof_items,
  requires_founder_approval = excluded.requires_founder_approval,
  grace_days = excluded.grace_days;

with program as (
  select id
  from public.programs
  where slug = '6-month-challenge'
),
level_lookup as (
  select id, position
  from public.levels
  where program_id = (select id from program)
)
delete from public.daily_task_templates
where program_id = (select id from program);

with program as (
  select id
  from public.programs
  where slug = '6-month-challenge'
),
level_lookup as (
  select id, position
  from public.levels
  where program_id = (select id from program)
)
insert into public.daily_task_templates (
  program_id,
  level_id,
  title,
  description,
  sort_order,
  is_required,
  proof_required,
  proof_type_hint
)
select
  program.id,
  level_lookup.id,
  template_data.title,
  template_data.description,
  template_data.sort_order,
  true,
  template_data.proof_required,
  template_data.proof_type_hint::public.proof_type
from program
join level_lookup on true
join lateral (
  values
    (
      1,
      'Wake Up With a Plan',
      'Set a fixed wake time and start the day on your terms.',
      true,
      'metric'
    ),
    (
      2,
      'Protect The Deep Work Block',
      'Complete the day''s most important focused work block before distraction takes over.',
      true,
      'note'
    ),
    (
      3,
      'Complete The Daily Blueprint',
      'Finish the required daily checklist tied to the active level.',
      false,
      'note'
    ),
    (
      4,
      'End The Day With A Review',
      'Close the day with an honest review of wins, misses, and lessons.',
      false,
      'note'
    )
) as template_data(sort_order, title, description, proof_required, proof_type_hint) on true
where level_lookup.position between 1 and 6;

with week_lookup as (
  select
    pw.id,
    pw.week_number,
    l.id as level_id
  from public.program_weeks pw
  join public.levels l on l.id = pw.level_id
  join public.programs p on p.id = pw.program_id
  where p.slug = '6-month-challenge'
)
delete from public.weekly_mission_templates
where program_id = (
  select id
  from public.programs
  where slug = '6-month-challenge'
);

with week_lookup as (
  select
    pw.id,
    pw.week_number,
    l.id as level_id
  from public.program_weeks pw
  join public.levels l on l.id = pw.level_id
  join public.programs p on p.id = pw.program_id
  where p.slug = '6-month-challenge'
)
insert into public.weekly_mission_templates (
  program_id,
  level_id,
  program_week_id,
  title,
  instructions,
  success_criteria
)
select
  p.id,
  week_lookup.level_id,
  week_lookup.id,
  'Week ' || week_lookup.week_number || ' Mission',
  'Define the one mission that matters most this week, make it visible, and review it during the weekly scorecard.',
  'Mission completed, scorecard submitted, and adjustments documented by the review deadline.'
from week_lookup
join public.programs p on p.slug = '6-month-challenge'
on conflict do nothing;
