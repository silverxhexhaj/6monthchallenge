const timeBlocks = [
  {
    time: "5:00 AM",
    title: "Wake Up — No Snooze",
    description:
      "The moment the alarm goes off, you're up. No negotiation with comfort. Start with intention.",
  },
  {
    time: "5:15 AM",
    title: "Mindset Priming",
    description:
      "Affirmations, visualization, journaling. Feed your mind before the world gets a chance to. Plant the seeds for the day.",
  },
  {
    time: "6:00 AM",
    title: "Physical Training",
    description:
      "Train your body with intensity. Push past yesterday's limits. Growth only happens under pressure.",
  },
  {
    time: "7:30 AM",
    title: "Deep Work Block #1",
    description:
      "Your most important work gets your freshest energy. No distractions. No phone. Pure, focused execution on your primary goal.",
  },
  {
    time: "12:00 PM",
    title: "Refuel & Reassess",
    description:
      "Proper nutrition. Review your morning progress. Adjust your afternoon plan if needed.",
  },
  {
    time: "1:00 PM",
    title: "Deep Work Block #2",
    description:
      "Continue executing on your goals. Skill-building, business growth, or whatever moves the needle most.",
  },
  {
    time: "6:00 PM",
    title: "Review & Reflect",
    description:
      "Did I give my absolute best today? Did I hold myself to the highest standard? Plan tomorrow before you rest.",
  },
  {
    time: "10:00 PM",
    title: "Recover",
    description:
      "Sleep is not optional — it's a weapon. 7–8 hours of quality rest to rebuild your body and mind for tomorrow's battle.",
  },
];

export function Blueprint() {
  return (
    <section className="border-t border-border bg-dark px-8 py-24">
      <div className="mx-auto max-w-[800px]">
        <h2 className="mb-4 text-center font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px] text-accent">
          Your Daily Blueprint
        </h2>
        <p className="mx-auto mb-12 max-w-[500px] text-center text-muted">
          Every single day for 6 months follows this structure. No negotiation,
          no exceptions.
        </p>
        <div className="space-y-0">
          {timeBlocks.map((block, index) => (
            <div
              key={block.time}
              className={`flex flex-col gap-6 border-b border-border py-6 max-[600px]:flex-col max-[600px]:gap-2 sm:flex-row sm:items-start ${
                index === timeBlocks.length - 1 ? "border-b-0" : ""
              }`}
            >
              <div className="min-w-[110px] font-bebas text-xl tracking-[1px] text-accent max-[600px]:min-w-0">
                {block.time}
              </div>
              <div className="flex-1">
                <h4 className="mb-1 text-base font-bold">{block.title}</h4>
                <p className="text-[0.88rem] text-muted">{block.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
