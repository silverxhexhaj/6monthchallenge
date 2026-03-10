import Link from "next/link";

const stats = [
  { num: "180", label: "Days" },
  { num: "6", label: "Levels" },
  { num: "1", label: "Mission" },
];

export function Hero() {
  return (
    <section className="hero-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 py-8 text-center">
      <div className="relative z-10 mb-8 inline-block border border-accent px-6 py-2 text-xs uppercase tracking-[4px] text-accent animate-[fadeDown_1s_ease_0.2s_both]">
        Cohort 1 — Waitlist Open
      </div>
      <h1 className="relative z-10 font-bebas text-[clamp(4rem,12vw,11rem)] leading-[0.9] tracking-[-2px] animate-[fadeDown_1s_ease_0.4s_both]">
        THE 6-MONTH
        <br />
        <span className="block bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent">
          CHALLENGE
        </span>
      </h1>
      <p className="relative z-10 mx-auto mt-6 max-w-[620px] text-[clamp(1rem,2vw,1.25rem)] text-muted animate-[fadeDown_1s_ease_0.6s_both]">
        A gamified self-improvement system for ambitious people who need a real
        structure, public accountability, and proof they followed through — not
        just another motivational read.
      </p>
      <div className="relative z-10 mt-12 flex flex-col items-center gap-4 sm:flex-row animate-[fadeDown_1s_ease_0.8s_both]">
        <Link
          href="/waitlist"
          className="inline-block bg-accent px-12 py-4 text-[0.85rem] font-bold tracking-[3px] text-black no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_40px_rgba(232,197,71,0.2)]"
        >
          Join the Waitlist
        </Link>
        <Link
          href="/login"
          className="inline-block border border-border px-8 py-4 text-[0.85rem] font-bold tracking-[3px] text-muted no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          Member Login
        </Link>
        <Link
          href="/journey"
          className="inline-block border border-border px-8 py-4 text-[0.85rem] font-bold tracking-[3px] text-muted no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          Follow the Journey ↗
        </Link>
      </div>
      <div className="relative z-10 mt-14 flex gap-12 animate-[fadeDown_1s_ease_1s_both]">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-bebas text-[2.5rem] leading-none text-accent">{s.num}</div>
            <div className="mt-1 text-xs uppercase tracking-[2px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-[bounce_2s_ease_infinite]"
        aria-hidden
      >
        <span
          className="block h-[60px] w-px"
          style={{ background: "linear-gradient(to bottom, transparent, var(--accent))" }}
        />
      </div>
    </section>
  );
}
