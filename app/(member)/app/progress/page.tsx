import { InfoCard } from "@/components/system/InfoCard";
import { StatusBadge } from "@/components/system/StatusBadge";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getProgressSnapshot } from "@/lib/supabase/queries/member";
import { requireMemberAppViewer } from "@/lib/supabase/queries/viewer";

export default async function ProgressPage() {
  const viewer = await requireMemberAppViewer();
  const progress = await getProgressSnapshot(viewer.memberProgram);

  return (
    <SurfaceShell
      eyebrow="Level Progress"
      title="Progress And Unlock Visibility."
      description="This surface shows the current level, the baseline unlock checklist, and the audit trail of level decisions stored in Supabase."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard
          title="Current Level"
          description={progress.currentLevel?.summary ?? "Current level summary unavailable."}
        >
          <div className="space-y-3 text-sm text-muted">
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="success">
                {progress.currentLevel?.title ?? "No level"}
              </StatusBadge>
              <StatusBadge tone="neutral">
                Day {viewer.memberProgram.current_day}
              </StatusBadge>
            </div>
            <p>Completed days: <span className="text-white">{progress.completedDays}</span></p>
            <p>Missed days: <span className="text-white">{progress.missedDays}</span></p>
            <p>Proof items: <span className="text-white">{progress.proofCount}</span></p>
            <p>
              Weekly reviews submitted:{" "}
              <span className="text-white">{progress.weeklyReviewsSubmitted}</span>
            </p>
            <p>
              Monthly review:{" "}
              <span className="text-white">
                {progress.monthlyReviewSubmitted ? "submitted" : "not yet"}
              </span>
            </p>
          </div>
        </InfoCard>
        <InfoCard
          title="Unlock Checklist"
          description="The UI reports against stored server data, but it does not unlock levels by itself."
        >
          {progress.currentRule && progress.unlockChecklist ? (
            <div className="space-y-3 text-sm text-muted">
              <ChecklistRow
                label={`Completed days (${progress.currentRule.minimum_completed_days})`}
                met={progress.unlockChecklist.completedDaysMet}
              />
              <ChecklistRow
                label={`Weekly reviews (${progress.currentRule.minimum_weekly_reviews_submitted})`}
                met={progress.unlockChecklist.weeklyReviewsMet}
              />
              <ChecklistRow
                label="Monthly review submitted"
                met={progress.unlockChecklist.monthlyReviewMet}
              />
              <ChecklistRow
                label={`Missed day cap (${progress.currentRule.maximum_missed_days ?? "none"})`}
                met={progress.unlockChecklist.missedDaysMet}
              />
            </div>
          ) : (
            <p className="text-sm text-muted">No unlock rule has been loaded yet.</p>
          )}
        </InfoCard>
      </div>
      <div className="mt-8">
        <InfoCard
          title="Audit History"
          description="Automatic evaluations and admin overrides will appear here when they are written."
        >
          <div className="space-y-4">
            {progress.levelHistory.length === 0 ? (
              <p className="text-sm text-muted">No level decisions have been recorded yet.</p>
            ) : null}
            {progress.levelHistory.map((entry) => (
              <div key={entry.id} className="border border-border p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={entry.eligible ? "success" : "warning"}>
                    {entry.eligible ? "eligible" : "not eligible"}
                  </StatusBadge>
                  <StatusBadge tone="neutral">{entry.decision_source}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-[1.7] text-muted">
                  {entry.decision_reason ?? "No decision reason stored."}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[3px] text-muted">
                  Evaluation window {entry.evaluation_started_on} to {entry.evaluation_ended_on}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}

function ChecklistRow({
  label,
  met,
}: {
  label: string;
  met: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border border-border px-4 py-3">
      <span>{label}</span>
      <StatusBadge tone={met ? "success" : "warning"}>{met ? "met" : "open"}</StatusBadge>
    </div>
  );
}
