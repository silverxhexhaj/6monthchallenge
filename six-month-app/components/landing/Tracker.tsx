const months = [
  { num: "01", color: "text-phase1", label: "Month One", focus: "Master Time" },
  { num: "02", color: "text-phase2", label: "Month Two", focus: "Build Discipline" },
  { num: "03", color: "text-phase3", label: "Month Three", focus: "Raise Standards" },
  { num: "04", color: "text-phase4", label: "Month Four", focus: "Forge Mindset" },
  { num: "05", color: "text-phase5", label: "Month Five", focus: "Full Execution" },
  { num: "06", color: "text-accent", label: "Month Six", focus: "Unstoppable" },
];

export function Tracker() {
  return (
    <section className="border-t border-border px-8 py-24">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-4 text-center font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          Your 6-Month Journey
        </h2>
        <p className="mb-12 text-center text-muted">
          Each month builds on the last. No phase is optional.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {months.map((month) => (
            <div
              key={month.num}
              className="border border-border bg-card p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:border-accent"
            >
              <div className={`font-bebas text-[2.5rem] leading-none ${month.color}`}>
                {month.num}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[2px] text-muted">
                {month.label}
              </div>
              <div className="mt-3 text-[0.82rem] font-medium text-accent">
                {month.focus}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
