import Link from "next/link";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-8 py-32 text-center before:absolute before:inset-0 before:content-[''] before:bg-[radial-gradient(ellipse_at_center,rgba(232,197,71,0.06)_0%,transparent_70%)]">
      <h2 className="relative z-10 font-bebas text-[clamp(3rem,8vw,6rem)] leading-[0.95]">
        The Next 6 Months
        <br />
        <span className="block bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent">
          Start Now.
        </span>
      </h2>
      <p className="relative z-10 mx-auto my-6 max-w-[550px] text-muted">
        Cohort 1 is waitlist-first while checkout is deferred. Reserve your spot,
        follow the founder&apos;s journey on X, or sign in if you already have access.
      </p>
      <div className="relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/waitlist"
          className="inline-block bg-accent px-16 py-5 text-[0.9rem] font-bold tracking-[3px] text-black no-underline uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_15px_50px_rgba(232,197,71,0.15)]"
        >
          Join The Waitlist
        </Link>
        <Link
          href="/login"
          className="inline-block border border-border px-10 py-5 text-[0.9rem] font-bold tracking-[3px] text-muted no-underline uppercase transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent"
        >
          Member Login
        </Link>
        <a
          href="https://x.com/silverxhexhaj"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-border px-10 py-5 text-[0.9rem] font-bold tracking-[3px] text-muted no-underline uppercase transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent"
        >
          Follow on X ↗
        </a>
      </div>
    </section>
  );
}
