const levels = [
  { num: "01", color: "text-phase1", label: "Level One", month: "Month 1", focus: "Command Time" },
  { num: "02", color: "text-phase2", label: "Level Two", month: "Month 2", focus: "Forge Discipline" },
  { num: "03", color: "text-phase3", label: "Level Three", month: "Month 3", focus: "Raise Standards" },
  { num: "04", color: "text-phase4", label: "Level Four", month: "Month 4", focus: "Fortress Mind" },
  { num: "05", color: "text-phase5", label: "Level Five", month: "Month 5", focus: "Full Execution" },
  { num: "06", color: "text-accent", label: "Level Six", month: "Month 6", focus: "Unstoppable" },
];

export function Tracker() {
  return (
    <section className="border-t border-border px-8 py-24">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-4 text-center font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px]">
          Six Levels. No Shortcuts.
        </h2>
        <p className="mb-12 text-center text-muted">
          Each level unlocks the next. Every phase builds on the last. You cannot skip ahead.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {levels.map((level) => (
            <div
              key={level.num}
              className="border border-border bg-card p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:border-accent"
            >
              <div className={`font-bebas text-[2.5rem] leading-none ${level.color}`}>
                {level.num}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[2px] text-muted">
                {level.label}
              </div>
              <div className="mt-1 text-[0.7rem] uppercase tracking-[1px] text-muted opacity-50">
                {level.month}
              </div>
              <div className="mt-2 text-[0.82rem] font-medium text-accent">
                {level.focus}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
