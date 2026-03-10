import type { PhaseColor } from "@/lib/phaseData";
import type { PhaseData } from "@/lib/phaseData";

const colorClasses: Record<PhaseColor, string> = {
  phase1: "text-phase1",
  phase2: "text-phase2",
  phase3: "text-phase3",
  phase4: "text-phase4",
  phase5: "text-phase5",
  phase6: "text-phase6",
};

const borderColorClasses: Record<PhaseColor, string> = {
  phase1: "before:bg-phase1",
  phase2: "before:bg-phase2",
  phase3: "before:bg-phase3",
  phase4: "before:bg-phase4",
  phase5: "before:bg-phase5",
  phase6: "before:bg-phase6",
};

interface PhaseSectionProps {
  phase: PhaseData;
}

export function PhaseSection({ phase }: PhaseSectionProps) {
  const textColor = colorClasses[phase.color];
  const borderColor = borderColorClasses[phase.color];

  return (
    <section
      id={`phase${phase.id}`}
      className="border-t border-border px-8 py-24 first:border-t-0"
    >
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-12 flex flex-wrap items-end gap-6 max-[600px]:flex-col max-[600px]:gap-2">
          <div
            className={`font-bebas text-[clamp(5rem,10vw,8rem)] leading-[0.85] opacity-15 ${textColor}`}
          >
            {phase.number}
          </div>
          <div>
            <h2
              className={`font-bebas text-[clamp(2rem,4vw,3rem)] tracking-[2px] leading-tight ${textColor}`}
            >
              {phase.title}
            </h2>
            <div className={`mt-1 text-xs uppercase tracking-[3px] ${textColor}`}>
              {phase.timeline}
            </div>
          </div>
        </div>
        <p className="mb-10 max-w-[700px] text-[1.05rem] text-muted">
          {phase.description}
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-[600px]:grid-cols-1">
          {phase.actions.map((action) => (
            <div
              key={action.title}
              className={`relative overflow-hidden border border-border bg-card p-8 transition-all duration-400 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:content-[''] before:transition-[height] hover:-translate-y-0.5 hover:border-[#333] ${borderColor}`}
            >
              <span className="mb-3 block text-2xl">{action.icon}</span>
              <h4 className="mb-3 font-bebas text-lg tracking-[1.5px]">
                {action.title}
              </h4>
              <p className="text-[0.88rem] leading-[1.7] text-muted">
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
