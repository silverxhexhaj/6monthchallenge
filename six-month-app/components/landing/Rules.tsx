const rules = [
  {
    num: "01",
    title: "Take Full Ownership",
    description:
      "No blaming circumstances, your past, your environment, or other people. Your decisions brought you here. Your decisions will take you forward.",
  },
  {
    num: "02",
    title: "Never Negotiate With Yourself",
    description:
      'The moment you ask "do I feel like it?" you\'ve already lost. Decide in advance. Execute without questioning.',
  },
  {
    num: "03",
    title: "Protect Your Time Like Your Life Depends On It",
    description:
      "Every hour is either moving you forward or pulling you back. There is no neutral. Treat time as your most valuable resource.",
  },
  {
    num: "04",
    title: "Discipline Over Motivation",
    description:
      "Motivation is temporary. Discipline is permanent. Build the habit of executing without needing to feel inspired.",
  },
  {
    num: "05",
    title: "Raise Standards Continuously",
    description:
      'What you tolerate becomes your ceiling. Never accept "good enough." Demand excellence in every area, every day.',
  },
  {
    num: "06",
    title: "Control Your Mind",
    description:
      "Your mind is either your greatest weapon or your biggest obstacle. Feed it strength, belief, and focus. Starve doubt, fear, and negativity.",
  },
  {
    num: "07",
    title: "Chase Discomfort",
    description:
      "Growth only happens under pressure. If you're comfortable, you're not growing. Seek the hard path intentionally.",
  },
  {
    num: "08",
    title: "Execute With Speed",
    description:
      "Action kills fear. Momentum creates opportunity. Move fast, move decisively, and never wait for perfect conditions.",
  },
  {
    num: "09",
    title: "Guard Your Environment",
    description:
      "Remove negativity, toxic people, and distractions from your life. Your environment shapes your mind, and your mind shapes your results.",
  },
  {
    num: "10",
    title: "No Breaks, No Excuses, No Going Back",
    description:
      "For 6 months, there are no days off from your commitment. Once you start seeing who you can become, you'll never want to go back.",
  },
];

export function Rules() {
  return (
    <section className="border-t border-border px-8 py-24">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-12 text-center font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          The 10 Non-Negotiable Rules
        </h2>
        <div className="space-y-0">
          {rules.map((rule, index) => (
            <div
              key={rule.num}
              className={`flex flex-col gap-6 border-b border-border py-7 max-[600px]:flex-col max-[600px]:gap-2 sm:flex-row sm:items-start ${
                index === rules.length - 1 ? "border-b-0" : ""
              }`}
            >
              <div className="min-w-[50px] font-bebas text-[2.5rem] leading-none text-accent">
                {rule.num}
              </div>
              <div className="flex-1">
                <h4 className="mb-1 text-[1.05rem] font-bold">{rule.title}</h4>
                <p className="text-sm text-muted">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
