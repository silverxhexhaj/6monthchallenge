# 6-Month Challenge Progression Engine

## Purpose
Define how level unlocks are evaluated, recorded, overridden, and surfaced so the 180-day structure stays deterministic and auditable.

## Core Rule
A member progresses through the challenge only when the backend evaluates the configured rules for the current level and writes a decision record. The UI can display eligibility, but it cannot grant progression by itself.

## Source Tables
- `member_programs`
- `member_daily_tasks`
- `daily_checkins`
- `weekly_reviews`
- `monthly_reviews`
- `level_unlock_rules`
- `level_progress`

## Progression Model

### Current State
`member_programs` stores the member's active challenge state:
- `current_level_id`
- `current_day`
- `account_state`
- `enrollment_state`

### Rule Configuration
Each `levels` row has one active `level_unlock_rules` row with:
- `minimum_completed_days`
- `minimum_weekly_reviews_submitted`
- `monthly_review_required`
- `maximum_missed_days`
- `minimum_proof_items`
- `requires_founder_approval`
- `grace_days`

### Decision Record
Every evaluation writes a `level_progress` row with:
- evaluated level
- eligibility result
- metrics snapshot
- decision source
- decision reason
- evaluator identity when overridden manually

## MVP Unlock Strategy

### Baseline Unlock Conditions
For a member to unlock the next level, the engine should confirm:
1. The member completed the current level's day window.
2. The member met the minimum completed-day threshold.
3. The member submitted the required number of weekly reviews.
4. The member submitted the monthly review if required.
5. The member did not exceed the maximum missed-day allowance.
6. The member met the minimum proof requirement if configured.
7. The member has an active entitlement and is not in a blocked account state.

### Suggested Initial Thresholds
- Level 1 unlock:
  - `minimum_completed_days = 24`
  - `minimum_weekly_reviews_submitted = 4`
  - `monthly_review_required = true`
  - `maximum_missed_days = 6`
- Levels 2-5 unlock:
  - keep the same initial rule set until real completion data suggests tuning
- Level 6:
  - does not unlock another level
  - instead records completion eligibility for day 180 summary

These numbers are starting defaults, not permanent product promises.

## Evaluation Windows
- Automatic checks run when:
  - a monthly review is submitted
  - the member reaches the end day of the current level
  - an admin requests reevaluation
- Grace period:
  - `grace_days` allows a short window after the level end date for late review submission
- During the grace window:
  - the dashboard can show `pending evaluation`
  - the member remains on the current level

## Evaluation Algorithm
1. Read the member's active `member_programs` row.
2. Resolve the current level and its `level_unlock_rules`.
3. Compute metrics for the current level window:
   - completed days
   - missed days
   - weekly reviews submitted
   - monthly review submitted or not
   - proof item count
4. Build a `metrics_snapshot` JSON payload.
5. Decide `eligible = true` only if all active rules pass.
6. Insert a `level_progress` record with `decision_source = automatic`.
7. If eligible and there is a next level:
   - update `member_programs.current_level_id`
   - keep `current_day` untouched
   - optionally trigger `level_unlocked` notification
8. If not eligible:
   - keep member on the current level
   - expose required recovery actions in the UI

## Metrics Snapshot Shape
Recommended `metrics_snapshot` payload:

```json
{
  "level_position": 2,
  "window_start_day": 31,
  "window_end_day": 60,
  "completed_days": 26,
  "missed_days": 4,
  "weekly_reviews_submitted": 4,
  "monthly_review_submitted": true,
  "proof_items_count": 18,
  "entitlement_active": true,
  "evaluated_at": "2026-04-30T18:15:00Z"
}
```

## Admin Override Model

### Allowed Override Types
- `admin_override`
  - manually grant progression even if a rule failed
- `admin_block`
  - prevent progression even if automatic rules passed

### Required Admin Fields
- `decided_by`
- `decision_reason`
- `metrics_snapshot`

### Override Rules
- Overrides must create a new `level_progress` row.
- Overrides must never mutate or delete the original automatic decision row.
- The current member level changes only after the override row is written successfully.
- Override reasons should be human-readable for future support and audit review.

## Recovery Model
If a member is not eligible:
- keep the member on the current level
- show the failed requirements in the dashboard
- allow completion of missing review steps during the grace window
- support explicit founder intervention after the grace window

The system should not silently skip failed members forward.

## Account-State Guardrails
The engine should refuse automatic unlock when:
- `account_state = paused`
- `account_state = refunded`
- `account_state = banned`
- no active entitlement exists

`alumni` is only relevant after program completion.

## UX States To Support
- `on_track`
- `pending_review`
- `pending_evaluation`
- `unlocked`
- `recovery_required`
- `blocked_by_account_state`
- `overridden`

These can be derived from stored progression and review records rather than stored as a separate source-of-truth column.

## Notification Triggers
- Send `level_unlocked` after a successful automatic or admin-granted unlock.
- Send `missed_day_followup` or equivalent reminder if a member becomes ineligible because of missing completion patterns.
- Log all notifications in `notification_events`.

## Founder/Admin Views
Admin operations should expose:
- current level
- next level target
- latest evaluation result
- failed requirements
- override history
- account-state blockers

## Non-Negotiable Rules
- One evaluation must produce one audit row.
- Automatic and manual decisions must both be preserved.
- `member_programs.current_level_id` changes only through server-owned progression logic.
- Unlock requirements must be data-driven, not hardcoded in page components.
