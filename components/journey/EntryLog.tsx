import type { CheckIn } from "@/lib/journeyData";

interface EntryLogProps {
  // All entries except the first (latest), which is shown separately
  entries: CheckIn[];
}

const typeLabel: Record<CheckIn["type"], string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const typeColor: Record<CheckIn["type"], string> = {
  daily: "text-muted border-border",
  weekly: "text-accent border-accent",
  monthly: "text-phase3 border-phase3",
};

export function EntryLog({ entries }: EntryLogProps) {
  if (entries.length === 0) return null;

  return (
    <section className="border-t border-border px-8 py-16">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-8">
          <div className="mb-1 text-xs uppercase tracking-[4px] text-muted">History</div>
          <h2 className="font-bebas text-[clamp(1.8rem,4vw,2.8rem)] tracking-[1px]">
            Past Entries
          </h2>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => {
            const date = new Date(entry.date + "T12:00:00");
            const formatted = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const colorClass = typeColor[entry.type];

            return (
              <div
                key={entry.id}
                className="border border-border bg-card p-6 transition-all duration-300 hover:border-[#333]"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`border px-3 py-1 text-[0.65rem] uppercase tracking-[2px] ${colorClass}`}
                    >
                      {typeLabel[entry.type]}
                    </span>
                    <h3 className="font-bebas text-[1.1rem] tracking-[1px]">{entry.title}</h3>
                  </div>
                  <span className="text-[0.75rem] text-muted">{formatted}</span>
                </div>

                <p className="mb-4 text-[0.88rem] leading-[1.7] text-muted">{entry.summary}</p>

                <div className="flex flex-wrap gap-2">
                  {entry.wins.slice(0, 2).map((w, i) => (
                    <span key={i} className="text-[0.75rem] text-phase4">
                      ✓ {w}
                    </span>
                  ))}
                  {entry.wins.length > 2 && (
                    <span className="text-[0.75rem] text-muted">
                      +{entry.wins.length - 2} more wins
                    </span>
                  )}
                </div>

                {entry.xPostUrl && (
                  <a
                    href={entry.xPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-[0.75rem] uppercase tracking-[2px] text-muted no-underline transition-colors hover:text-accent"
                  >
                    View on X ↗
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
