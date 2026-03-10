import type { CheckIn } from "@/lib/journeyData";

interface LatestCheckInProps {
  entry: CheckIn;
}

const typeLabel: Record<CheckIn["type"], string> = {
  daily: "Daily Check-in",
  weekly: "Weekly Scorecard",
  monthly: "Monthly Deep Review",
};

export function LatestCheckIn({ entry }: LatestCheckInProps) {
  const date = new Date(entry.date + "T12:00:00");
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="border-t border-border px-8 py-16">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-xs uppercase tracking-[4px] text-accent">
              Most Recent Update
            </div>
            <h2 className="font-bebas text-[clamp(1.8rem,4vw,2.8rem)] tracking-[1px]">
              {entry.title}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-[0.75rem] uppercase tracking-[2px] text-muted">{typeLabel[entry.type]}</div>
            <div className="mt-1 text-[0.85rem] text-muted">{formatted}</div>
          </div>
        </div>

        <p className="mb-8 text-[1.05rem] leading-[1.85] text-muted">{entry.summary}</p>

        {/* Wins / Misses / Lessons */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-border bg-card p-6">
            <div className="mb-4 text-xs uppercase tracking-[3px] text-phase4">Wins</div>
            <ul className="space-y-2">
              {entry.wins.map((w, i) => (
                <li key={i} className="flex gap-2 text-[0.85rem] leading-[1.65] text-muted">
                  <span className="mt-[3px] shrink-0 text-phase4">✓</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border bg-card p-6">
            <div className="mb-4 text-xs uppercase tracking-[3px] text-phase2">Misses</div>
            <ul className="space-y-2">
              {entry.misses.map((m, i) => (
                <li key={i} className="flex gap-2 text-[0.85rem] leading-[1.65] text-muted">
                  <span className="mt-[3px] shrink-0 text-phase2">✗</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border bg-card p-6">
            <div className="mb-4 text-xs uppercase tracking-[3px] text-phase3">Lessons</div>
            <ul className="space-y-2">
              {entry.lessons.map((l, i) => (
                <li key={i} className="flex gap-2 text-[0.85rem] leading-[1.65] text-muted">
                  <span className="mt-[3px] shrink-0 text-phase3">→</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Proof items */}
        {entry.proofItems && entry.proofItems.length > 0 && (
          <div>
            <div className="mb-4 text-xs uppercase tracking-[3px] text-muted">Proof</div>
            <div className="flex flex-wrap gap-3">
              {entry.proofItems.map((item, i) => (
                <div
                  key={i}
                  className="border border-border bg-card px-4 py-3"
                >
                  <div className="text-[0.65rem] uppercase tracking-[2px] text-muted">{item.label}</div>
                  <div className="mt-1 text-[0.95rem] font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Link to X post */}
        {entry.xPostUrl && (
          <div className="mt-8">
            <a
              href={entry.xPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-accent px-8 py-3 text-[0.8rem] font-bold uppercase tracking-[3px] text-accent no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-black"
            >
              View Post on X ↗
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
