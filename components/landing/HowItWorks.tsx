const steps = [
  {
    num: "01",
    title: "Choose Your Mission",
    description:
      "Define the one area you are committing to transform over 6 months — discipline, business, body, mindset, or all of them. You enter the challenge with a clear, personal goal.",
  },
  {
    num: "02",
    title: "Follow Your Daily Structure",
    description:
      "Every day has a fixed blueprint — wake time, deep work blocks, physical training, and a nightly review. No guessing, no wasted time, no negotiating with yourself.",
  },
  {
    num: "03",
    title: "Complete Weekly Missions",
    description:
      "Each week delivers a focused challenge that builds on the last. These are not optional extras — they are the game. Complete them or fall behind.",
  },
  {
    num: "04",
    title: "Track Your Streak",
    description:
      "Log daily completions and watch your streak grow. Streaks build identity. Milestones mark real progress. Your consistency becomes visible and undeniable.",
  },
  {
    num: "05",
    title: "Level Up Every Month",
    description:
      "Each of the 6 months is a new level with a new focus. The challenge intensifies as you grow. You do not go back — you only move forward.",
  },
  {
    num: "06",
    title: "Finish With Proof",
    description:
      "After 6 months you have something most people never build: documented transformation. Habits, results, and a version of yourself you can actually be proud of.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border px-8 py-24">
      <div className="mx-auto max-w-[1000px]">
        <h2 className="mb-4 text-center font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          How The Challenge Works
        </h2>
        <p className="mb-16 text-center text-muted">
          Six months. Six levels. One system. One outcome.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent"
            >
              <div className="font-bebas text-[3.5rem] leading-none text-accent opacity-25">
                {step.num}
              </div>
              <h3 className="mt-3 font-bebas text-[1.3rem] tracking-[1.5px]">{step.title}</h3>
              <p className="mt-3 text-sm leading-[1.7] text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
