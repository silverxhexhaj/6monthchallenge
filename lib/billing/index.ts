export interface CheckoutIntent {
  mode: "waitlist" | "open_enrollment";
  cohortSlug?: string;
  successUrl: string;
  cancelUrl: string;
}

export function createCheckoutIntent(intent: CheckoutIntent) {
  return {
    provider: "stripe" as const,
    ...intent,
  };
}
