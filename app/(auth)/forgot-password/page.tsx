import { redirect } from "next/navigation";
import { forgotPasswordAction } from "@/app/(auth)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getDefaultSignedInPath, getViewerContext } from "@/lib/supabase/queries/viewer";

interface ForgotPasswordPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const [viewer, params] = await Promise.all([getViewerContext(), searchParams]);

  if (viewer) {
    redirect(getDefaultSignedInPath(viewer));
  }

  return (
    <SurfaceShell
      eyebrow="Auth Surface"
      title="Reset Your Password."
      description="Enter your email and we&apos;ll send a recovery link that lands back inside this app."
    >
      <InfoCard
        title="Recovery Email"
        description="For security, the confirmation screen looks the same whether or not the account exists."
      >
        <form action={forgotPasswordAction} className="space-y-4">
          {params.message ? <MessageBanner message={params.message} /> : null}
          {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
          >
            Send Reset Email
          </button>
        </form>
      </InfoCard>
    </SurfaceShell>
  );
}
