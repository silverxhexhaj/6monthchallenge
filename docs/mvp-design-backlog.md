# 6-Month Challenge Design Backlog

## Goal
Define the minimum design work required to ship a credible, mobile-first MVP across marketing, onboarding, member execution, and founder/admin surfaces.

## Priority Legend
- `P0`: must exist before build or before launch
- `P1`: should exist before launch hardening
- `P2`: can follow after core flows are proven

## P0 Design Work

### 1. Information Architecture
- Finalize the three-surface model:
  - marketing
  - member app
  - founder/admin
- Define navigation rules for anonymous, new member, active member, and founder/admin states.
- Output:
  - sitemap
  - route inventory
  - signed-off screen list

### 2. Acquisition Funnel
- Design homepage CTA states for:
  - waitlist-open
  - checkout-open
  - cohort-closed
- Design the waitlist page and submission-confirmation states.
- Design the checkout entry page and trust-building content blocks.
- Output:
  - responsive marketing screens
  - CTA-state rules
  - copy-ready funnel wireframes

### 3. Founder Proof Surface
- Refine the founder journey page for daily, weekly, monthly, and live proof entries.
- Define proof card variants for:
  - metrics
  - notes
  - links
  - images
- Output:
  - public founder feed patterns
  - archive and latest-entry layout

### 4. Auth And Onboarding
- Design:
  - sign up
  - login
  - magic-link or password recovery states
  - onboarding steps
- Onboarding steps must include:
  - primary goal
  - secondary goals
  - baseline
  - start date
  - rules acceptance
  - reminder preferences
- Output:
  - stepper flow
  - validation/error states
  - success redirect rules

### 5. Member Dashboard And Today Flow
- Design the MVP dashboard with:
  - current day
  - current level
  - streak state
  - today’s tasks
  - next review deadline
  - founder update highlight
- Design the `/app/today` completion flow optimized for mobile speed.
- Output:
  - dashboard spec
  - task state library
  - mobile first-pass designs

### 6. Review Flows
- Design:
  - daily closeout
  - weekly review
  - monthly review
- Include draft, submitted, missed, and locked states.
- Output:
  - review form patterns
  - progress and deadline UI

### 7. Founder/Admin Ops
- Design core admin screens:
  - members
  - cohorts
  - content
  - announcements
  - overrides
- Output:
  - dense table patterns
  - filters and row actions
  - override confirmation flows

## P1 Design Work

### 8. Proof Visibility And Public Sharing
- Design private vs public proof toggles.
- Design the public-proof preview state for opt-in members.

### 9. Reminder And Notification UX
- Design email entry points and in-app reminder surfaces.
- Define copy and state language for:
  - missed day
  - weekly review due
  - level unlocked

### 10. Empty, Error, And Edge States
- Cover:
  - no active cohort
  - payment mismatch
  - expired access
  - no tasks generated
  - failed upload
  - locked review

## P2 Design Work

### 11. Post-MVP Enhancement Exploration
- Public member profiles
- richer proof galleries
- external-community deep links
- referral and alumni moments

## Shared Design System Requirements
- Preserve the current serious, high-contrast brand direction from the marketing site.
- Normalize language from `phase` to `level` everywhere.
- Create reusable status tokens for:
  - `due`
  - `completed`
  - `missed`
  - `locked`
  - `at_risk`
  - `paused`
  - `alumni`
- Ensure all critical flows work on mobile widths before desktop refinement.

## Design Handoff Order
1. Information architecture and acquisition funnel
2. Auth and onboarding
3. Dashboard and today flow
4. Reviews and proof logging
5. Founder/admin operations
6. Edge states and launch polish
