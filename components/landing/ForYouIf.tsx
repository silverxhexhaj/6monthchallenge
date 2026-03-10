const qualifiers = [
  {
    icon: "⚡",
    text: "You have big goals but keep falling off track after a few weeks",
  },
  {
    icon: "🎯",
    text: "You want a real structure — not just another motivational post or YouTube video",
  },
  {
    icon: "📊",
    text: "You want to track visible progress week by week, not just feel busy",
  },
  {
    icon: "🔒",
    text: "You are ready to commit to 6 months of focused, non-negotiable effort",
  },
  {
    icon: "👥",
    text: "You want accountability and a community doing the same challenge alongside you",
  },
  {
    icon: "📢",
    text: "You want to document your transformation publicly and prove it to yourself",
  },
];

const notFor = [
  "You're looking for quick fixes or results without real effort",
  "You're not willing to commit to a daily structure",
  "You need someone else to keep you motivated",
];

export function ForYouIf() {
  return (
    <section className="border-t border-border bg-dark px-8 py-24">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-4 text-center font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          This Is For You If
        </h2>
        <p className="mb-12 text-center text-muted">
          The 6-Month Challenge is not for everyone — and that is exactly the point.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {qualifiers.map((q) => (
            <div
              key={q.text}
              className="flex items-start gap-4 border border-border bg-card p-6 transition-all duration-300 hover:border-accent"
            >
              <span className="mt-0.5 text-2xl">{q.icon}</span>
              <p className="text-sm leading-[1.7] text-muted">{q.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 border border-border bg-card p-8">
          <h4 className="mb-4 font-bebas text-xl tracking-[2px] text-phase2">
            This Is NOT For You If
          </h4>
          <div className="space-y-3">
            {notFor.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-0.5 text-phase2">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
