import { updatePasswordAction } from "@/app/(auth)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { SurfaceShell } from "@/components/system/SurfaceShell";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <SurfaceShell
      eyebrow="Auth Surface"
      title="Set A New Password."
      description="Open this page from the recovery email and save a new password for your challenge account."
    >
      <InfoCard
        title="New Password"
        description="If the recovery link expires, request a fresh reset email from the login page."
      >
        <form action={updatePasswordAction} className="space-y-4">
          {params.message ? <MessageBanner message={params.message} /> : null}
          {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">New Password</span>
            <input
              type="password"
              name="password"
              minLength={8}
              required
              className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              minLength={8}
              required
              className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
          >
            Update Password
          </button>
        </form>
      </InfoCard>
    </SurfaceShell>
  );
}
