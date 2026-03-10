export interface OnboardingDraft {
  primaryGoal: string;
  secondaryGoals: string[];
  baseline: Record<string, string | number | boolean>;
  startDate: string;
  rulesAccepted: boolean;
  reminderTime?: string;
  timezone: string;
}

export function isOnboardingReady(draft: OnboardingDraft) {
  return (
    Boolean(draft.primaryGoal.trim()) &&
    Boolean(draft.startDate) &&
    draft.rulesAccepted &&
    Boolean(draft.timezone)
  );
}

export function normalizeSecondaryGoals(rawValue: string) {
  return rawValue
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function createBaselineSnapshot(hoursPerDay: number, disciplineScore: number, notes: string) {
  return {
    hoursPerDay,
    disciplineScore,
    notes: notes.trim(),
  };
}
