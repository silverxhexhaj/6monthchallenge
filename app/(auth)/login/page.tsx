import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/(auth)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getDefaultSignedInPath, getViewerContext } from "@/lib/supabase/queries/viewer";

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [viewer, params] = await Promise.all([getViewerContext(), searchParams]);

  if (viewer) {
    redirect(getDefaultSignedInPath(viewer));
  }

  return (
    <SurfaceShell
      eyebrow="Auth Surface"
      title="Login To Resume The 6-Month Challenge."
      description="Use your account to continue onboarding, finish today&apos;s work, review progress, or manage founder operations."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard title="Sign In" description="Member and founder access use the same login.">
          <form action={signInAction} className="space-y-4">
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
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Password</span>
              <input
                type="password"
                name="password"
                required
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
            >
              Sign In
            </button>
          </form>
        </InfoCard>
        <InfoCard
          title="Need Access?"
          description="New members can create an account now. Existing members can recover access without touching support."
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href="/forgot-password"
              className="border border-border px-4 py-2 text-xs uppercase tracking-[3px] text-muted no-underline"
            >
              Forgot Password
            </Link>
            <Link
              href="/signup"
              className="border border-border px-4 py-2 text-xs uppercase tracking-[3px] text-muted no-underline"
            >
              Create Account
            </Link>
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
