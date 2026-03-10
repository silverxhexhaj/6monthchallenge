export type AccountState =
  | "waitlisted"
  | "invited"
  | "active"
  | "paused"
  | "refunded"
  | "alumni"
  | "banned";

export type EnrollmentState =
  | "waitlist"
  | "checkout_started"
  | "paid"
  | "onboarding"
  | "in_program"
  | "completed";

export function hasActiveAccess(accountState: AccountState) {
  return accountState === "active" || accountState === "alumni";
}

export function needsOnboarding(enrollmentState: EnrollmentState) {
  return enrollmentState === "paid" || enrollmentState === "onboarding" || enrollmentState === "waitlist";
}

export function canAccessMemberApp(
  accountState: AccountState,
  enrollmentState: EnrollmentState,
) {
  return hasActiveAccess(accountState) && (enrollmentState === "in_program" || enrollmentState === "completed");
}
