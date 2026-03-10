import type { Metadata } from "next";
import { JourneyHeader } from "@/components/journey/JourneyHeader";
import { LatestCheckIn } from "@/components/journey/LatestCheckIn";
import { EntryLog } from "@/components/journey/EntryLog";
import { JourneyCta } from "@/components/journey/JourneyCta";
import { Footer } from "@/components/landing/Footer";
import { founderProfile } from "@/lib/journeyData";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Silver's Journey — 6-Month Challenge",
  description:
    "Live public progress log. Every check-in, scorecard, and proof item from the founder doing the 6-month challenge in real time.",
};

export default function JourneyPage() {
  const [latest, ...rest] = founderProfile.entries;

  return (
    <>
      {/* Nav back to home */}
      <nav className="flex items-center justify-between border-b border-border px-8 py-5">
        <Link
          href="/"
          className="text-[0.75rem] uppercase tracking-[3px] text-muted no-underline transition-colors hover:text-accent"
        >
          ← The Challenge
        </Link>
        <span className="text-[0.75rem] uppercase tracking-[2px] text-muted">
          Founder&apos;s Progress
        </span>
      </nav>

      <JourneyHeader profile={founderProfile} />

      {latest && <LatestCheckIn entry={latest} />}

      {rest.length > 0 && <EntryLog entries={rest} />}

      <JourneyCta profile={founderProfile} />

      <Footer />
    </>
  );
}
