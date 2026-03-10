import Link from "next/link";
import type { ProgressProfile } from "@/lib/journeyData";

interface JourneyCtaProps {
  profile: ProgressProfile;
}

export function JourneyCta({ profile }: JourneyCtaProps) {
  return (
    <section className="border-t border-border px-8 py-20 text-center">
      <div className="mx-auto max-w-[640px]">
        <div className="mb-5 inline-block border border-accent px-6 py-2 text-xs uppercase tracking-[4px] text-accent">
          Follow Live
        </div>
        <h2 className="mb-5 font-bebas text-[clamp(2.2rem,5vw,3.5rem)] tracking-[2px]">
          Watch the proof{" "}
          <span className="bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent">
            build in real time
          </span>
        </h2>
        <p className="mb-10 text-[1rem] leading-[1.8] text-muted">
          Daily posts on X. Full updates here. No filters, no highlight reel — just the
          real process of someone doing the system exactly as designed.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={profile.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent px-12 py-4 text-[0.85rem] font-bold tracking-[3px] text-black no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_40px_rgba(232,197,71,0.2)]"
          >
            Follow {profile.handle} on X ↗
          </a>
          <Link
            href="/#pricing"
            className="inline-block border border-border px-8 py-4 text-[0.85rem] font-bold tracking-[3px] text-muted no-underline uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            Join the Challenge
          </Link>
        </div>
      </div>
    </section>
  );
}
