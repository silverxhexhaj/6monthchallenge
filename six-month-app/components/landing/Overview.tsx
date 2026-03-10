const overviewCards = [
  {
    num: "01",
    title: "Take Full Responsibility",
    description:
      "Your decisions have led you here. Own every outcome and stop blaming external forces. From this moment, everything is on you.",
  },
  {
    num: "02",
    title: "Define Crystal-Clear Goals",
    description:
      "Vague goals create vague results. Get specific about what you want: measurable, precise, with a deadline of 6 months.",
  },
  {
    num: "03",
    title: "Build Your Road Map",
    description:
      "Break goals into daily, weekly, and monthly actions. Know exactly what needs to be done every single day.",
  },
  {
    num: "04",
    title: "Execute Relentlessly",
    description:
      "Stop negotiating with yourself. Remove emotion from execution. Your actions are non-negotiable from this point forward.",
  },
];

export function Overview() {
  return (
    <section
      id="roadmap"
      className="border-y border-border bg-dark px-8 py-24"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <div
            key={card.num}
            className="border border-border bg-card p-10 transition-all duration-400 hover:-translate-y-1 hover:border-accent"
          >
            <div className="font-bebas text-[3.5rem] leading-none text-accent">
              {card.num}
            </div>
            <h3 className="mt-3 font-bebas text-[1.4rem] tracking-[2px]">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-[1.7] text-muted">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
