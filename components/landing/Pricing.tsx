import Link from "next/link";

const features = [
  "Complete 6-month challenge framework",
  "Daily blueprint and proven structure",
  "Weekly missions and prompts",
  "Progress tracking system",
  "Private accountability community",
  "Founder-led insights and updates",
  "Access to all 5 levels",
  "One-time payment — no recurring fees",
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border bg-dark px-8 py-24">
      <div className="mx-auto max-w-[600px] text-center">
        <div className="mb-6 inline-block border border-accent px-6 py-2 text-xs uppercase tracking-[4px] text-accent">
          Cohort 1 — Early Access
        </div>
        <h2 className="mb-4 font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          One Payment.
          <br />
          <span className="bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent">
            Six Months of Access.
          </span>
        </h2>
        <p className="mb-12 text-muted">
          No monthly fees. No subscriptions. Pay once and get the full
          6-month challenge system, community, and founder updates.
        </p>
        <div className="border border-accent bg-card p-10">
          <div className="mb-2 text-xs uppercase tracking-[4px] text-muted">Challenge Pass</div>
          <div className="my-4 font-bebas text-[5rem] leading-none text-accent">$97</div>
          <div className="mb-8 text-sm text-muted">one-time payment · full 6-month access</div>
          <div className="mb-10 space-y-3 text-left">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-muted">
                <span className="text-accent">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <Link
            href="mailto:hello@6monthchallenge.com"
            className="block w-full bg-accent py-5 text-center text-[0.9rem] font-bold tracking-[3px] text-black no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_15px_50px_rgba(232,197,71,0.15)]"
          >
            Join the Waitlist
          </Link>
          <p className="mt-4 text-xs text-muted opacity-60">
            Cohort 1 spots are limited. You will be notified when the challenge opens.
          </p>
        </div>
      </div>
    </section>
  );
}
