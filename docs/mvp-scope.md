# 6-Month Challenge MVP Scope

## Product Goal
Launch a credible paid MVP that moves a user from landing page to active daily execution inside a 180-day challenge system with minimal founder-side operational chaos.

## In Scope

### Public Surface
- Homepage with clear positioning, level overview, founder proof, and CTA states
- Founder journey page with public proof and progress archive
- Waitlist flow for pre-launch or closed enrollment windows
- Checkout entry flow for open enrollment windows
- Lead attribution and conversion tracking

### Member Surface
- Authentication
- Paid access and entitlement checks
- Onboarding with mission, baseline, start date, rules, reminder preferences, and cohort assignment
- Dashboard showing current day, current level, due tasks, streak state, and next review
- Daily task completion and same-day edits
- Proof logging for note, metric, link, and image
- Daily closeout check-in
- Weekly review
- Monthly review
- Level progression status and next-unlock visibility

### Founder/Admin Surface
- Member list and account-state controls
- Cohort assignment and enrollment-window management
- Challenge content management for levels, weeks, tasks, and missions
- Founder announcements and update publishing
- Manual override support for access and progression
- Basic operational views for inactive or at-risk members

### Platform Layer
- Supabase auth, Postgres, storage, and RLS
- Stripe checkout and entitlement sync
- Resend email flows
- PostHog event tracking
- Sentry error monitoring
- Optional n8n workflows for reminders or ops automation

## Out Of Scope
- Deep native community feed and moderation system
- Public member profiles as a primary MVP feature
- Advanced referrals and share loops
- AI coaching, AI summaries, or AI risk scoring
- Push notifications, SMS, or native mobile apps
- Team, moderator, or coach role complexity beyond a simple founder/admin model

## Launch Modes

### Pre-Launch
- Default CTA routes to a waitlist flow
- Users receive founder updates and launch notifications
- Attribution is captured before account creation

### Open Enrollment
- CTA can route directly to checkout
- Successful payment leads to account creation or auth recovery
- Paid members enter onboarding immediately

## Acceptance Criteria
- A visitor can understand the offer and join the waitlist end to end
- A buyer can pay, authenticate, complete onboarding, and land on a useful day-1 dashboard
- A member can complete daily tasks, submit proof, submit a weekly review, submit a monthly review, and see progression state
- A founder can manage member state, publish updates, and override access or progression without touching the database directly

## Migration Notes From Current App
- Replace the `mailto` CTA in `components/landing/Pricing.tsx` with a real waitlist or checkout route.
- Replace five-phase landing terminology from `lib/phaseData.ts` with canonical six-level content stored in the database.
- Keep `app/page.tsx` and `app/journey/page.tsx` as the starting marketing routes, then layer route groups around them.
- Treat `lib/journeyData.ts` as a prototype for future `daily_checkins`, `weekly_reviews`, `monthly_reviews`, and public founder proof records.
