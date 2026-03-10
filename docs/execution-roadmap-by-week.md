# 6-Month Challenge Execution Roadmap By Week

## Purpose
This document converts the PRD into a week-by-week execution roadmap focused on shipping a credible MVP, validating launch readiness, and creating a clean path into post-MVP expansion.

## Planning Assumptions
- Primary goal: launch the MVP defined in the PRD
- Timeline: `12 weeks` from kickoff to launch
- Team shape: founder-led with lean design and engineering support
- Build approach: ship the core operating system first, then add accountability, admin, and optimization layers
- Canonical structure: `6 levels over 180 days` must be normalized before feature expansion

## Success Criteria For This Roadmap
By the end of Week 12, the product should support:
- Public marketing site with real waitlist or checkout flow
- Auth, paid access, and onboarding
- Member dashboard with daily execution flows
- Weekly reviews and monthly progression
- Founder/admin workflows
- Email reminders, analytics, and error monitoring
- Launch readiness validation against the PRD checklist

## Weekly Execution Roadmap

### Week 1: Decisions, Scope Lock, and System Design
**Goal:** remove ambiguity before implementation starts.

**Focus areas**
- Resolve immediate product decisions from the PRD:
  - Cohort-based, rolling, or hybrid enrollment
  - Waitlist-first or checkout-first launch
  - Native or external community for MVP
  - Proof visibility default
  - Level unlock criteria
- Finalize MVP scope and explicitly defer post-MVP items
- Define canonical program taxonomy: program, level, week, mission, daily task, review, proof, cohort
- Confirm stack choices: `Next.js`, `Supabase`, `Stripe`, `Resend`, `PostHog`, `Sentry`, `n8n`

**Deliverables**
- Locked product decisions doc
- MVP feature checklist
- Core entity/data model draft
- Technical architecture and environment plan

**Exit criteria**
- No unresolved product decisions blocking implementation
- Database and app architecture approved

### Week 2: Foundation and Data Model
**Goal:** establish the core platform foundation.

**Focus areas**
- Set up Supabase project structure, auth model, storage buckets, and RLS approach
- Create initial schema for users, member profiles, programs, levels, weeks, daily tasks, reviews, proof items, payments, cohorts, and notifications
- Migrate static challenge structure toward canonical program entities
- Establish app layout, route groups, environment variables, and shared types

**Deliverables**
- Initial database schema
- Shared TypeScript models
- Seed data for 6 levels and starter weeks
- Environment setup across local and hosted environments

**Exit criteria**
- Core entities exist and seed successfully
- Challenge terminology is normalized across the codebase

### Week 3: Public Site and Conversion Funnel
**Goal:** make acquisition credible and measurable.

**Focus areas**
- Refine homepage messaging around who the challenge is for, how it works, and founder proof
- Build or finish founder journey page
- Replace placeholder `mailto` flows with real waitlist or checkout funnel
- Add CTA states, capture source/referral metadata, and confirmation flows
- Implement SEO basics and analytics hooks on acquisition paths

**Deliverables**
- Production-ready homepage and founder journey pages
- Waitlist capture or checkout entry page
- Lead capture with metadata
- Baseline `PostHog` events for acquisition funnel

**Exit criteria**
- A visitor can understand the offer and enter the funnel end to end
- Conversion events are being tracked

### Week 4: Authentication, Entitlements, and Account States
**Goal:** connect identity, payment state, and protected access.

**Focus areas**
- Implement auth flow using email/password or magic link
- Model account states: active, paused, refunded, alumni, banned
- Connect payment state to entitlements
- Protect member-only routes and data
- Define error states for incomplete payment, expired access, and account issues

**Deliverables**
- Auth screens and session handling
- Protected member routes
- Entitlement checks wired to account state
- Account lifecycle rules documented

**Exit criteria**
- Only entitled users can access member features
- Access behavior is consistent across account states

### Week 5: Onboarding and Member Initialization
**Goal:** turn a new buyer into an activated member with a clear day 1.

**Focus areas**
- Build onboarding flow: account setup, primary goal, baseline, start date, rules acceptance, reminder preferences, cohort assignment
- Generate initial member profile and current level
- Create first-week checklist and day-1 setup tasks
- Store onboarding completion and activation events

**Deliverables**
- Complete onboarding flow
- Member profile creation logic
- Baseline metrics capture
- First-week task generation

**Exit criteria**
- A new paid user can complete onboarding without manual intervention
- Onboarding outputs are stored correctly

### Week 6: Dashboard and Daily Execution System
**Goal:** ship the core daily operating system.

**Focus areas**
- Build dashboard with current day, level, streak, due tasks, review deadlines, and highlights
- Implement daily checklist and task completion states
- Add end-of-day review flow
- Support same-day edits and timestamped completion data
- Surface missed days and recovery messaging

**Deliverables**
- Member dashboard
- Daily task/check-in flows
- Completion state tracking
- Recovery state UI for missed execution

**Exit criteria**
- Members know exactly what to do today
- Daily completion data is stored and visible

### Week 7: Proof Logging and Weekly Reviews
**Goal:** make accountability visible and structured.

**Focus areas**
- Build proof logging for text, metrics, links, and image-ready storage structure
- Add weekly mission assignment and mission instructions
- Build weekly scorecard submission flow
- Track wins, misses, lessons, and next-week adjustments
- Flag missed weekly reviews

**Deliverables**
- Proof logging UI and storage model
- Weekly mission model and member view
- Weekly review submission flow
- Founder visibility into missing submissions

**Exit criteria**
- Members can submit proof and weekly reviews
- Weekly compliance gaps are visible to the system and founder

### Week 8: Monthly Reviews and Level Progression
**Goal:** make the 180-day structure real and auditable.

**Focus areas**
- Build monthly reflection flow
- Implement level completion criteria and unlock logic
- Prevent manual skipping while allowing admin override
- Create completion summary structure for day 180
- Add visibility into current level progress and next unlock requirements

**Deliverables**
- Monthly review flow
- Level progression rules engine
- Admin override support
- Progress visualization for levels and day count

**Exit criteria**
- Level unlock logic is deterministic and auditable
- Members can see how progression works

### Week 9: Founder/Admin Operating System
**Goal:** enable lean operations without manual chaos.

**Focus areas**
- Build admin dashboard for member list, cohort management, and status updates
- Add tools for challenge content, weekly mission scheduling, founder updates, and broadcast messaging
- Support manual overrides for access and progression
- Add simple exports and operational views for inactive or at-risk members

**Deliverables**
- Founder/admin dashboard
- Member management tools
- Content publishing workflows
- At-risk and inactive member views

**Exit criteria**
- Founder can operate the product without touching the database directly
- Core operations are manageable inside the app

### Week 10: Notifications, Community, and Accountability Loops
**Goal:** strengthen retention and follow-through.

**Focus areas**
- Implement `Resend` email flows for welcome, daily reminder, missed-day follow-up, weekly review due, level unlocked, and founder broadcasts
- Build MVP community layer:
  - If native: structured feed, founder announcements, prompts
  - If external: integrate access and linking while keeping progress tracking in-app
- Add accountability nudges and at-risk triggers
- Wire basic workflow automation in `n8n` where useful

**Deliverables**
- Transactional email templates and triggers
- MVP community or announcement system
- Reminder automation flows
- At-risk member alert logic

**Exit criteria**
- Members receive key reminder and broadcast communications
- Accountability loops run without manual founder chasing

### Week 11: Analytics, Quality, and Launch Hardening
**Goal:** prepare the MVP for real users.

**Focus areas**
- Complete event tracking for acquisition, activation, engagement, retention, and referrals
- Add `Sentry` monitoring and audit critical flows
- Validate mobile usability, accessibility, and performance on core journeys
- Test edge cases: missed days, incomplete onboarding, payment/access mismatch, review deadlines, admin overrides
- Tighten copy, UX states, and support surfaces

**Deliverables**
- Full event tracking implementation
- Error monitoring
- QA checklist results
- Updated FAQ and support workflows

**Exit criteria**
- Launch readiness checklist is substantially green
- Critical flows are tested end to end

### Week 12: Launch Readiness, Soft Launch, and Iteration
**Goal:** launch the MVP with confidence and close the feedback loop fast.

**Focus areas**
- Run launch readiness review against the PRD checklist
- Soft launch with a small cohort or controlled enrollment window
- Monitor funnel conversion, onboarding completion, first-week activation, and review compliance
- Fix critical issues fast and tighten ops cadence
- Publish founder updates and collect first testimonials and proof stories

**Deliverables**
- Soft launch live
- KPI dashboard for launch week
- Triage list for immediate fixes
- Post-launch optimization backlog

**Exit criteria**
- Users can move from landing page to active daily execution
- Founder can monitor members, communicate, and intervene as needed

## Weekly Operating Cadence During Build
- Monday: set weekly build objective, confirm dependencies, publish internal priorities
- Wednesday: review risks, unblock technical and product decisions, validate scope
- Friday: demo shipped work, test against PRD acceptance criteria, update launch risk list

## Launch Gates
Before launch, all of the following must be true:
- Challenge taxonomy is normalized across all surfaces
- Conversion flow is real and measurable
- Auth and entitlements work reliably
- Onboarding, daily check-ins, weekly reviews, and monthly progression work end to end
- Founder publishing and member management are usable
- Email automations, analytics, and error monitoring are active
- Support and FAQ workflow is ready

## Post-MVP Weekly Sequence
Once MVP is stable, the next execution sequence should be:
- Week 13: public member profiles and richer proof presentation
- Week 14: referrals and share loops
- Week 15: accountability partner matching and stronger at-risk interventions
- Week 16: push notifications, leaderboard testing, and retention optimization

## Recommended Tracking Dashboard
Track these every week during execution:
- Build progress against roadmap
- Blockers and decision dependencies
- Visitor to lead conversion
- Visitor to purchase conversion
- Purchase to onboarding completion
- First 7-day completion
- Weekly review completion
- Level unlock rate
- Support issues and bug volume
