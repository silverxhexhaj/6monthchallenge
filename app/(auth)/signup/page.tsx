import Link from "next/link";
import { redirect } from "next/navigation";
import { signUpAction } from "@/app/(auth)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getDefaultSignedInPath, getViewerContext } from "@/lib/supabase/queries/viewer";

interface SignupPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const [viewer, params] = await Promise.all([getViewerContext(), searchParams]);

  if (viewer) {
    redirect(getDefaultSignedInPath(viewer));
  }

  return (
    <SurfaceShell
      eyebrow="Auth Surface"
      title="Create Your Member Account."
      description="Start with a real account now, then move straight into onboarding once your session is active."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard title="Create Account" description="Use a name you want displayed inside the app.">
          <form action={signUpAction} className="space-y-4">
            {params.message ? <MessageBanner message={params.message} /> : null}
            {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Display Name</span>
              <input
                type="text"
                name="displayName"
                required
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Email</span>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Timezone</span>
              <input
                type="text"
                name="timezone"
                defaultValue="UTC"
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Password</span>
              <input
                type="password"
                name="password"
                minLength={8}
                required
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
            >
              Create Account
            </button>
          </form>
        </InfoCard>
        <InfoCard
          title="Already Inside?"
          description="If you already have an account, log in instead of creating a duplicate profile."
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="border border-border px-4 py-2 text-xs uppercase tracking-[3px] text-muted no-underline"
            >
              Login
            </Link>
            <Link
              href="/forgot-password"
              className="border border-border px-4 py-2 text-xs uppercase tracking-[3px] text-muted no-underline"
            >
              Reset Password
            </Link>
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
