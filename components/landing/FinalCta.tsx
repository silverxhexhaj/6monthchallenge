import Link from "next/link";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-8 py-32 text-center before:absolute before:inset-0 before:content-[''] before:bg-[radial-gradient(ellipse_at_center,rgba(232,197,71,0.06)_0%,transparent_70%)]">
      <h2 className="relative z-10 font-bebas text-[clamp(3rem,8vw,6rem)] leading-[0.95]">
        The Next 6 Months
        <br />
        <span className="block bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent">
          Are Yours.
        </span>
      </h2>
      <p className="relative z-10 mx-auto my-6 max-w-[550px] text-muted">
        Move with speed. Move with purpose. Move with the kind of intensity
        that forces success to happen. When they&apos;re over, the world will
        not recognize you.
      </p>
      <Link
        href="#phase1"
        className="relative z-10 inline-block bg-accent px-16 py-5 text-[0.9rem] font-bold tracking-[3px] text-black no-underline uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_15px_50px_rgba(232,197,71,0.15)]"
      >
        Start Phase One Now
      </Link>
    </section>
  );
}
