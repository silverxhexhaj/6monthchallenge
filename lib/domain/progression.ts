export interface ProgressionSnapshot {
  currentLevel: number;
  completedDays: number;
  missedDays: number;
  weeklyReviewsSubmitted: number;
  monthlyReviewSubmitted: boolean;
}

export function canMeetBaselineUnlock(snapshot: ProgressionSnapshot) {
  return (
    snapshot.completedDays >= 24 &&
    snapshot.missedDays <= 6 &&
    snapshot.weeklyReviewsSubmitted >= 4 &&
    snapshot.monthlyReviewSubmitted
  );
}

export interface UnlockRuleSnapshot {
  minimumCompletedDays: number;
  minimumWeeklyReviewsSubmitted: number;
  monthlyReviewRequired: boolean;
  maximumMissedDays: number | null;
}

export function evaluateUnlockProgress(
  progress: ProgressionSnapshot,
  rule: UnlockRuleSnapshot,
) {
  return {
    completedDaysMet: progress.completedDays >= rule.minimumCompletedDays,
    weeklyReviewsMet:
      progress.weeklyReviewsSubmitted >= rule.minimumWeeklyReviewsSubmitted,
    monthlyReviewMet:
      !rule.monthlyReviewRequired || progress.monthlyReviewSubmitted,
    missedDaysMet:
      rule.maximumMissedDays === null || progress.missedDays <= rule.maximumMissedDays,
  };
}
