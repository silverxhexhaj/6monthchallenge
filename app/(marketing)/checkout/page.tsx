import Link from "next/link";
import { InfoCard } from "@/components/system/InfoCard";
import { SurfaceShell } from "@/components/system/SurfaceShell";

export default function CheckoutPage() {
  return (
    <SurfaceShell
      eyebrow="Open Enrollment"
      title="Checkout Is Deferred For This Milestone."
      description="Stripe is intentionally skipped right now. This page explains the future enrollment path while directing real users to waitlist or member login."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard
          title="Future State"
          description="When billing is enabled again, this route should create a checkout session and hand buyers into auth plus onboarding."
        >
          <div className="space-y-3 text-sm text-muted">
            <p>Offer summary</p>
            <p>Cohort window context</p>
            <p>Checkout start tracking</p>
            <p>Success and cancel handling</p>
          </div>
        </InfoCard>
        <InfoCard
          title="What To Do Now"
          description="The app is usable today through seeded users and Supabase auth."
        >
          <Link
            href="/waitlist"
            className="inline-block bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black no-underline"
          >
            Join The Waitlist
          </Link>
          <Link
            href="/login"
            className="ml-3 inline-block border border-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-accent no-underline"
          >
            Member Login
          </Link>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
