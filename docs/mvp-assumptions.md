# 6-Month Challenge MVP Assumptions

## Purpose
This document locks the baseline product assumptions that the MVP build, schema, and app architecture should use unless explicitly changed later.

## Locked Product Decisions
- Launch model: `hybrid`
  - Pre-launch uses a real waitlist and founder email updates.
  - Open enrollment uses checkout plus immediate account activation and onboarding.
- Community model: `external community at MVP`
  - Community conversation can live outside the app.
  - Progress, proof, streaks, reviews, and level progression remain in-app.
- Proof visibility default: `private by default with opt-in public proof`
  - Members choose what becomes public proof.
  - Founder proof remains intentionally public.
- Progression model: `configurable rules + admin override`
  - Unlock logic should be driven by database rules and audited decisions.
  - The UI should never be the source of truth for unlocks.

## Canonical Product Structure
- The product uses `6 levels across 180 days`.
- The current five-phase content in `lib/phaseData.ts` becomes the first five canonical levels.
- Level 6 is the final integration stage already implied in `lib/journeyData.ts` as `Unstoppable`.
- The canonical hierarchy is:
  - `program`
  - `level`
  - `week`
  - `daily task template`
  - `member progress records`

## Current-State Gaps To Resolve
- `app/page.tsx` renders a marketing-only experience with no waitlist form, auth, or member application.
- `components/landing/Pricing.tsx` still uses a `mailto` CTA and promises a private community without a real funnel.
- `components/landing/Hero.tsx` still shows `5` levels in the hero stats.
- `lib/phaseData.ts` is static content and still models only five phases.
- `lib/journeyData.ts` is founder-only mock data, but its structure is a useful seed for member check-ins and public proof.

## MVP Scope Guardrails
- One program at launch: `6-Month Challenge`
- One founder/admin role is enough for MVP
- Email is the only required reminder channel for MVP
- Mobile web is required; native apps are out of scope
- The admin system can be internal and pragmatic as long as it avoids direct database edits

## Explicit MVP Includes
- Public marketing site with founder proof
- Waitlist capture and checkout-ready acquisition flow
- Auth and paid entitlements
- Onboarding and member initialization
- Dashboard, daily task completion, proof logging, and daily closeout
- Weekly reviews, monthly reviews, and auditable level progression
- Founder/admin member management, announcements, and overrides
- Email reminders, analytics, and error monitoring

## Explicit MVP Excludes
- Native in-app community feed depth beyond lightweight announcements or external links
- Accountability partner matching
- Push notifications and SMS
- AI-generated coaching or summaries
- Native mobile apps
- Multi-program support

## Working Principle
When scope pressure appears, the system should favor:
- reliable daily execution over richer social features
- auditable progression over clever UI shortcuts
- simple founder operations over configurable complexity
