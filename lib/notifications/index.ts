export const notificationTypes = [
  "welcome",
  "onboarding_complete",
  "daily_reminder",
  "missed_day_followup",
  "weekly_review_due",
  "level_unlocked",
  "founder_broadcast",
  "payment_update",
] as const;

export type NotificationType = (typeof notificationTypes)[number];

export interface NotificationDraft {
  type: NotificationType;
  subject: string;
  previewText: string;
}

export function createNotificationDraft(
  type: NotificationType,
  subject: string,
  previewText: string,
): NotificationDraft {
  return {
    type,
    subject,
    previewText,
  };
}
