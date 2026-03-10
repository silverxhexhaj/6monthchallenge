# 6-Month Challenge Engineering Backlog

## Goal
Turn the MVP scope into an implementation sequence that can ship the paid challenge system without blocking core launch paths on lower-value features.

## Priority Legend
- `P0`: launch-critical
- `P1`: important before soft launch
- `P2`: useful follow-up after the MVP loop works

## P0 Engineering Work

### 1. Project Foundation
- Add Supabase project wiring, environment variables, and typed clients.
- Establish server/client utility boundaries.
- Add integration placeholders for Stripe, Resend, PostHog, and Sentry.
- Deliverables:
  - `lib/supabase`
  - env contract
  - base integration modules

### 2. Content Normalization
- Define the database-backed `program`, `level`, `week`, and task-template model.
- Map the current `lib/phaseData.ts` content into the seed format.
- Preserve existing public-page rendering while the migration happens.
- Deliverables:
  - seed data shape
  - migration mapping document
  - database-backed content read path

### 3. Schema And RLS
- Create all MVP tables, enums, indexes, views, and policies from the schema spec.
- Add storage bucket setup notes and proof-asset handling rules.
- Deliverables:
  - initial migration set
  - RLS policy matrix implemented
  - public founder-proof query path

### 4. Hybrid Acquisition Flow
- Build waitlist submission flow and confirmation state.
- Add enrollment-window configuration to switch CTA behavior.
- Build checkout session creation and success/cancel flows.
- Deliverables:
  - `/waitlist`
  - `/checkout`
  - lead capture writes
  - checkout start + completion events

### 5. Auth And Entitlements
- Add sign up, login, session handling, and protected routes.
- Sync Stripe payment success to entitlements and member state.
- Redirect users into onboarding or member app based on state.
- Deliverables:
  - auth flow
  - route protection
  - entitlement checks

### 6. Onboarding And Member Initialization
- Build onboarding form flow and persistence.
- Create active `member_programs` state from onboarding completion.
- Generate first week of member tasks.
- Deliverables:
  - onboarding writes
  - reminder preferences
  - baseline storage
  - initial task generation

### 7. Member Dashboard And Today Flow
- Build dashboard queries and the `/app/today` completion loop.
- Add task completion writes and same-day edit windows.
- Deliverables:
  - dashboard page
  - today page
  - member task mutations

### 8. Proof Logging
- Support proof creation for:
  - note
  - metric
  - link
  - image
- Add visibility controls and storage handling.
- Deliverables:
  - proof write/read APIs or server actions
  - image upload flow
  - public-proof eligibility logic

### 9. Reviews
- Build daily check-ins, weekly reviews, and monthly reviews as separate records.
- Add due-date, draft, submitted, missed, and locked states.
- Deliverables:
  - review forms
  - review queries
  - review state enforcement

### 10. Progression Engine
- Evaluate unlock rules from database configuration.
- Write audited `level_progress` decisions.
- Update `member_programs.current_level_id` only through server-owned progression logic.
- Deliverables:
  - progression evaluator
  - admin override path
  - next-unlock snapshot for dashboard

### 11. Founder/Admin Surface
- Build admin route protection and founder dashboard shell.
- Add screens for:
  - members
  - cohorts
  - content
  - announcements
  - overrides
- Deliverables:
  - `/admin/*`
  - audit-friendly mutations
  - at-risk member filters

## P1 Engineering Work

### 12. Notifications And Lifecycle Automation
- Add Resend email templates and notification event writes.
- Trigger:
  - welcome
  - onboarding complete
  - daily reminder
  - missed day follow-up
  - weekly review due
  - level unlocked
  - founder broadcast
- Deliverables:
  - notification service
  - scheduled reminder path

### 13. Analytics And Monitoring
- Add PostHog event helpers and validate event payloads.
- Add Sentry to public, member, and admin surfaces.
- Deliverables:
  - event map implemented
  - error monitoring configured

### 14. QA Hardening
- Test critical flows:
  - waitlist submit
  - purchase to onboarding
  - onboarding to dashboard
  - task completion
  - review submission
  - progression unlock
  - admin override
- Deliverables:
  - launch checklist
  - issue triage list

## P2 Engineering Work

### 15. External Community Bridging
- Store community URL or invite metadata at the cohort level.
- Add contextual deep links from dashboard and announcements.

### 16. Reporting And Export Improvements
- Export leads, members, compliance, and payment status views.
- Add simple cohort and at-risk reporting slices.

## Suggested Build Order
1. Foundation and schema
2. Acquisition and auth
3. Onboarding and member initialization
4. Daily execution and proof
5. Reviews and progression
6. Founder/admin ops
7. Notifications, analytics, and hardening

## Dependency Notes
- Schema and content normalization should finish before dashboard and progression implementation.
- Entitlements must exist before protected member routes are considered done.
- Review flows should land before progression logic is marked production-ready.
- Admin overrides require the progression audit model first, not as an afterthought.
