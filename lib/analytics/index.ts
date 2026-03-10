export const analyticsEvents = {
  landingPageViewed: "landing_page_viewed",
  ctaClicked: "cta_clicked",
  waitlistSubmitted: "waitlist_submitted",
  checkoutStarted: "checkout_started",
  purchaseCompleted: "purchase_completed",
  signupCompleted: "signup_completed",
  onboardingCompleted: "onboarding_completed",
  dailyTaskCompleted: "daily_task_completed",
  dailyCheckinSubmitted: "daily_checkin_submitted",
  weeklyReviewSubmitted: "weekly_review_submitted",
  monthlyReviewSubmitted: "monthly_review_submitted",
  levelUnlocked: "level_unlocked",
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export interface AnalyticsEventPayload {
  userId?: string;
  anonymousId?: string;
  cohortId?: string;
  level?: number;
  source?: string;
  deviceType?: string;
  [key: string]: string | number | boolean | null | undefined;
}
