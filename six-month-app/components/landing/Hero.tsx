import Link from "next/link";

export function Hero() {
  return (
    <section className="hero-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 py-8 text-center">
      <div className="relative z-10 mb-8 inline-block border border-accent px-6 py-2 text-xs uppercase tracking-[4px] text-accent animate-[fadeDown_1s_ease_0.2s_both]">
        The Complete Roadmap
      </div>
      <h1 className="relative z-10 font-bebas text-[clamp(4rem,12vw,11rem)] leading-[0.9] tracking-[-2px] animate-[fadeDown_1s_ease_0.4s_both]">
        6 MONTHS
        <br />
        <span className="block bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent">
          TO TRANSFORM
          <br />
          YOUR LIFE
        </span>
      </h1>
      <p className="relative z-10 mx-auto mt-6 max-w-[600px] text-[clamp(1rem,2vw,1.25rem)] text-muted animate-[fadeDown_1s_ease_0.6s_both]">
        Not years. Not a lifetime. Just 6 months of focused effort, intense
        discipline, and unwavering commitment. This is your step-by-step plan.
      </p>
      <div className="relative z-10 mt-12 animate-[fadeDown_1s_ease_0.8s_both]">
        <Link
          href="#roadmap"
          className="inline-block bg-accent px-12 py-4 text-[0.85rem] font-bold tracking-[3px] text-black no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_40px_rgba(232,197,71,0.2)]"
        >
          Begin the Journey ↓
        </Link>
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
