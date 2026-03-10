import { Hero } from "@/components/landing/Hero";
import { ForYouIf } from "@/components/landing/ForYouIf";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Tracker } from "@/components/landing/Tracker";
import { PhaseSection } from "@/components/landing/PhaseSection";
import { WhatYouGet } from "@/components/landing/WhatYouGet";
import { FounderJourney } from "@/components/landing/FounderJourney";
import { Blueprint } from "@/components/landing/Blueprint";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { phases } from "@/lib/phaseData";

export default function Home() {
  return (
    <>
      <Hero />
      <ForYouIf />
      <HowItWorks />
      <Tracker />
      {phases.map((phase) => (
        <PhaseSection key={phase.id} phase={phase} />
      ))}
      <WhatYouGet />
      <FounderJourney />
      <Blueprint />
      <Pricing />
      <FinalCta />
      <Footer />
    </>
  );
}
