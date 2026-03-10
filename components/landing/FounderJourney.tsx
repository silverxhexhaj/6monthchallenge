const contentTypes = [
  {
    type: "Daily",
    description: "Check-ins: exactly what I completed, what I skipped, and why.",
  },
  {
    type: "Weekly",
    description: "Scorecards: wins, losses, key lessons, and adjustments for next week.",
  },
  {
    type: "Monthly",
    description: "Deep reviews: habits built, real results tracked, and honest mindset reflections.",
  },
  {
    type: "Live",
    description: "Real-time proof: screenshots, metrics, and unfiltered breakdowns.",
  },
];

export function FounderJourney() {
  return (
    <section className="border-t border-border px-8 py-24">
      <div className="mx-auto max-w-[800px] text-center">
        <div className="mb-6 inline-block border border-accent px-6 py-2 text-xs uppercase tracking-[4px] text-accent">
          The Founder&apos;s Journey
        </div>
        <h2 className="mb-6 font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          I Am Doing This{" "}
          <span className="bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent">
            Challenge Myself.
          </span>
        </h2>
        <p className="mb-12 text-[1.05rem] leading-[1.8] text-muted">
          I built this system and I am the first one to live it. Every day I document my progress
          publicly on X — the wins, the struggles, the ugly days, and the breakthroughs.
          If this system transforms me, it will transform you. Follow the journey and watch the
          proof build in real time.
        </p>
        <div className="mb-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {contentTypes.map((c) => (
            <div
              key={c.type}
              className="border border-border bg-card p-6 transition-all duration-300 hover:border-accent"
            >
              <div className="mb-2 text-xs uppercase tracking-[3px] text-accent">{c.type}</div>
              <p className="text-sm leading-[1.7] text-muted">{c.description}</p>
            </div>
          ))}
        </div>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent px-12 py-4 text-[0.85rem] font-bold tracking-[3px] text-black no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_40px_rgba(232,197,71,0.2)]"
        >
          Follow on X ↗
        </a>
      </div>
    </section>
  );
}
