import { LEVELS, daysSinceStart, daysRemaining, type ProgressProfile } from "@/lib/journeyData";

interface JourneyHeaderProps {
  profile: ProgressProfile;
}

export function JourneyHeader({ profile }: JourneyHeaderProps) {
  const level = LEVELS[profile.currentLevel - 1];
  const day = daysSinceStart(profile.startDate);
  const remaining = daysRemaining(profile.startDate);
  const progressPct = Math.min(100, Math.round((day / 180) * 100));

  return (
    <section className="hero-bg relative overflow-hidden border-b border-border px-8 py-20 text-center">
      <div className="relative z-10 mx-auto max-w-[760px]">
        <div className="mb-5 inline-block border border-accent px-6 py-2 text-xs uppercase tracking-[4px] text-accent">
          Founder&apos;s Journey — Live
        </div>

        <h1 className="font-bebas text-[clamp(3.5rem,10vw,7rem)] leading-[0.9] tracking-[-1px]">
          {profile.name}&apos;s
          <br />
          <span className={`block bg-gradient-to-br from-accent to-phase2 bg-clip-text text-transparent`}>
            Progress
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-[540px] text-[1rem] leading-[1.8] text-muted">
          Every win, every failure, every lesson — documented publicly.
          This is the real-time proof of the system in action.
        </p>

        {/* Live stats bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <div className="font-bebas text-[2.8rem] leading-none text-accent">{day}</div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-[2px] text-muted">Day</div>
          </div>
          <div className="w-px self-stretch bg-border" />
          <div className="text-center">
            <div className={`font-bebas text-[2.8rem] leading-none ${level.color}`}>
              {profile.currentLevel}
            </div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-[2px] text-muted">Level</div>
          </div>
          <div className="w-px self-stretch bg-border" />
          <div className="text-center">
            <div className="font-bebas text-[2.8rem] leading-none text-white">{remaining}</div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-[2px] text-muted">Days Left</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-[0.7rem] uppercase tracking-[2px] text-muted">
            <span>Day 1</span>
            <span>{progressPct}% complete</span>
            <span>Day 180</span>
          </div>
          <div className="h-[3px] w-full bg-border">
            <div
              className="h-full bg-gradient-to-r from-accent to-phase2 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Current level badge */}
        <div className={`mt-8 inline-block border ${level.border} px-6 py-3`}>
          <span className="text-[0.7rem] uppercase tracking-[3px] text-muted">Current Focus — </span>
          <span className={`text-[0.85rem] font-bold uppercase tracking-[2px] ${level.color}`}>
            {level.focus}
          </span>
        </div>
      </div>
    </section>
  );
}
