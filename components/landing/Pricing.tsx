import Link from "next/link";

const features = [
  "Complete 6-month challenge framework",
  "Daily blueprint and proven structure",
  "Weekly missions and prompts",
  "Progress tracking system",
  "External community handoff when live",
  "Founder-led insights and updates",
  "Access to all 6 levels",
  "Waitlist-first launch while checkout is deferred",
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border bg-dark px-8 py-24">
      <div className="mx-auto max-w-[600px] text-center">
        <div className="mb-6 inline-block border border-accent px-6 py-2 text-xs uppercase tracking-[4px] text-accent">
          Cohort 1 — Waitlist First
        </div>
        <h2 className="mb-4 font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          One Waitlist.
          <br />
          <span className="bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent">
            Six Months of Structure.
          </span>
        </h2>
        <p className="mb-12 text-muted">
          Billing is paused for now. Join the waitlist to get launch updates, then
          use member login if you already have seeded access.
        </p>
        <div className="border border-accent bg-card p-10">
          <div className="mb-2 text-xs uppercase tracking-[4px] text-muted">Launch Access</div>
          <div className="my-4 font-bebas text-[5rem] leading-none text-accent">WAITLIST</div>
          <div className="mb-8 text-sm text-muted">join now · checkout returns later</div>
          <div className="mb-10 space-y-3 text-left">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-muted">
                <span className="text-accent">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <Link
            href="/waitlist"
            className="block w-full bg-accent py-5 text-center text-[0.9rem] font-bold tracking-[3px] text-black no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_15px_50px_rgba(232,197,71,0.15)]"
          >
            Join the Waitlist
          </Link>
          <p className="mt-4 text-xs text-muted opacity-60">
            Existing members can still sign in while new enrollment stays on the waitlist.
          </p>
        </div>
      </div>
    </section>
  );
}
