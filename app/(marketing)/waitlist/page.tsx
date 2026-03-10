import Link from "next/link";
import { joinWaitlistAction } from "@/app/(marketing)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { SurfaceShell } from "@/components/system/SurfaceShell";

interface WaitlistPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function WaitlistPage({ searchParams }: WaitlistPageProps) {
  const params = await searchParams;

  return (
    <SurfaceShell
      eyebrow="Pre-Launch Funnel"
      title="Join The Waitlist."
      description="Enrollment is waitlist-first while billing is deferred. Reserve your place now and existing members can keep using the app."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <InfoCard
          title="Reserve Your Spot"
          description="Your lead goes straight into Supabase so acquisition can move forward before Stripe is added."
        >
          <form action={joinWaitlistAction} className="space-y-4">
            {params.message ? <MessageBanner message={params.message} /> : null}
            {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
            <input type="hidden" name="source" value="waitlist-page" />
            <input type="hidden" name="medium" value="web" />
            <input type="hidden" name="campaign" value="ui-mvp" />
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Full Name</span>
              <input
                type="text"
                name="fullName"
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Email</span>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
            >
              Join The Waitlist
            </button>
          </form>
        </InfoCard>
        <InfoCard
          title="Current Launch State"
          description="This is intentionally honest while Stripe is skipped for now."
        >
          <div className="space-y-3 text-sm text-muted">
            <p>The public funnel is waitlist-first.</p>
            <p>Existing seeded members can sign in and use the app today.</p>
            <p>Checkout messaging stays visible as a future enrollment state, not a live purchase flow.</p>
          </div>
          <Link
            href="/login"
            className="inline-block border border-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-accent no-underline"
          >
            Member Login
          </Link>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
