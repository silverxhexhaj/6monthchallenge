const requiredPublicEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

function getEnvVar(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export function getPublicEnv() {
  return {
    supabaseUrl: getEnvVar(requiredPublicEnvVars[0]),
    supabaseAnonKey: getEnvVar(requiredPublicEnvVars[1]),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    posthogHost: process.env.POSTHOG_HOST ?? "https://us.i.posthog.com",
  };
}

export function getServerEnv() {
  return {
    ...getPublicEnv(),
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    resendApiKey: process.env.RESEND_API_KEY,
    posthogKey: process.env.POSTHOG_KEY,
    sentryDsn: process.env.SENTRY_DSN,
  };
}
