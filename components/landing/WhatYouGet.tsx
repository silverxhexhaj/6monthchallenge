const inclusions = [
  {
    icon: "🗺️",
    title: "6-Month Challenge Framework",
    description:
      "A structured system across 6 levels with clear monthly goals, weekly missions, and daily non-negotiables. The roadmap from day one to day 180.",
  },
  {
    icon: "📅",
    title: "Daily Blueprint",
    description:
      "A proven daily schedule from 5 AM wake-up to 10 PM recovery. Every hour has a purpose. No more wondering what to do — just execute.",
  },
  {
    icon: "⚡",
    title: "Weekly Missions",
    description:
      "Each week delivers a new focused challenge that compounds over time. You always know exactly what to do next. No confusion, no drift.",
  },
  {
    icon: "📈",
    title: "Progress Tracking System",
    description:
      "Log your daily completions, track streaks, and visualize your momentum. Seeing your consistency builds identity. Missing it shows you the truth.",
  },
  {
    icon: "👥",
    title: "External Community Bridge",
    description:
      "Community can live outside the app at MVP. The product keeps execution, proof, reviews, and progression inside one system of record.",
  },
  {
    icon: "🎙️",
    title: "Founder-Led Insights",
    description:
      "The founder is doing this challenge publicly. Every insight, mistake, and breakthrough gets documented and shared with members in real time.",
  },
];

export function WhatYouGet() {
  return (
    <section className="border-t border-border bg-dark px-8 py-24">
      <div className="mx-auto max-w-[1000px]">
        <h2 className="mb-4 text-center font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          What You Get
        </h2>
        <p className="mb-16 text-center text-muted">
          Waitlist first. Full structure, proof, and execution flows inside the app.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inclusions.map((item) => (
            <div
              key={item.title}
              className="border border-border bg-card p-8 transition-all duration-300 hover:border-accent"
            >
              <span className="mb-4 block text-3xl">{item.icon}</span>
              <h4 className="mb-3 font-bebas text-[1.2rem] tracking-[1.5px]">{item.title}</h4>
              <p className="text-sm leading-[1.7] text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
