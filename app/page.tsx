import { Hero } from "@/components/landing/Hero";
import { Manifesto } from "@/components/landing/Manifesto";
import { Overview } from "@/components/landing/Overview";
import { PhaseSection } from "@/components/landing/PhaseSection";
import { Blueprint } from "@/components/landing/Blueprint";
import { Rules } from "@/components/landing/Rules";
import { Affirmations } from "@/components/landing/Affirmations";
import { Tracker } from "@/components/landing/Tracker";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { phases } from "@/lib/phaseData";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Overview />
      {phases.map((phase) => (
        <PhaseSection key={phase.id} phase={phase} />
      ))}
      <Blueprint />
      <Rules />
      <Affirmations />
      <Tracker />
      <FinalCta />
      <Footer />
    </>
  );
}
