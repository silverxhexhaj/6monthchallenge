import {
  createProofAction,
  submitDailyCheckinAction,
  updateTaskStatusAction,
} from "@/app/(member)/actions";
import { countCompletedTasks } from "@/lib/domain/daily-execution";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { StatusBadge } from "@/components/system/StatusBadge";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getDashboardSnapshot } from "@/lib/supabase/queries/member";
import { requireMemberAppViewer } from "@/lib/supabase/queries/viewer";

interface TodayPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const viewer = await requireMemberAppViewer();
  const [dashboard, params] = await Promise.all([
    getDashboardSnapshot(viewer),
    searchParams,
  ]);

  return (
    <SurfaceShell
      eyebrow="Daily Execution"
      title="Today&apos;s Execution Loop."
      description="Complete today&apos;s tasks, attach proof, and close the day with an honest review before the window ends."
    >
      <div className="mb-6 space-y-3">
        {params.message ? <MessageBanner message={params.message} /> : null}
        {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <InfoCard
          title="Today&apos;s Tasks"
          description={`${countCompletedTasks(
            dashboard.todayTasks.map((task) => ({
              id: task.id,
              title: task.title,
              status: task.status,
              proofRequired: task.proof_required,
            })),
          )}/${dashboard.todayTasks.length} completed`}
        >
          <div className="space-y-4">
            {dashboard.todayTasks.length === 0 ? (
              <p className="text-sm text-muted">
                No tasks generated for today yet. Finish onboarding or check your start date.
              </p>
            ) : null}
            {dashboard.todayTasks.map((task) => (
              <div key={task.id} className="border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bebas text-2xl tracking-[1px] text-white">{task.title}</h3>
                    <p className="mt-1 text-sm leading-[1.7] text-muted">{task.description}</p>
                  </div>
                  <StatusBadge
                    tone={
                      task.status === "completed"
                        ? "success"
                        : task.status === "missed" || task.status === "skipped"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {task.status}
                  </StatusBadge>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {task.status !== "completed" ? (
                    <form action={updateTaskStatusAction}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="status" value="completed" />
                      <input type="hidden" name="redirectTo" value="/app/today" />
                      <button
                        type="submit"
                        className="bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[3px] text-black"
                      >
                        Mark Complete
                      </button>
                    </form>
                  ) : (
                    <form action={updateTaskStatusAction}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="status" value="planned" />
                      <input type="hidden" name="redirectTo" value="/app/today" />
                      <button
                        type="submit"
                        className="border border-border px-4 py-2 text-xs uppercase tracking-[3px] text-muted"
                      >
                        Reopen
                      </button>
                    </form>
                  )}
                  <form action={updateTaskStatusAction}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="status" value="skipped" />
                    <input type="hidden" name="redirectTo" value="/app/today" />
                    <button
                      type="submit"
                      className="border border-border px-4 py-2 text-xs uppercase tracking-[3px] text-muted"
                    >
                      Skip
                    </button>
                  </form>
                </div>
                {task.proof_required ? (
                  <p className="mt-3 text-xs uppercase tracking-[3px] text-phase2">
                    Proof required before the day is closed.
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </InfoCard>
        <div className="space-y-6">
          <InfoCard
            title="Quick Proof"
            description="Attach note, metric, or link proof against today&apos;s work."
          >
            <form action={createProofAction} className="space-y-4">
              <input type="hidden" name="redirectTo" value="/app/today" />
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Type</span>
                <select
                  name="type"
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                >
                  <option value="note">Note</option>
                  <option value="metric">Metric</option>
                  <option value="link">Link</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Label</span>
                <input
                  type="text"
                  name="label"
                  required
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Note Value</span>
                <textarea
                  name="textValue"
                  rows={3}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Metric Value</span>
                  <input
                    type="number"
                    step="any"
                    name="numericValue"
                    className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Link URL</span>
                  <input
                    type="url"
                    name="url"
                    className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                  />
                </label>
              </div>
              <label className="flex items-center gap-3 text-sm text-muted">
                <input type="checkbox" name="visibility" value="public_opt_in" />
                Mark as public proof
              </label>
              <button
                type="submit"
                className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
              >
                Save Proof
              </button>
            </form>
          </InfoCard>
          <InfoCard
            title="Daily Closeout"
            description="Submit wins, misses, and lessons before the day resets."
          >
            <form action={submitDailyCheckinAction} className="space-y-4">
              <input type="hidden" name="redirectTo" value="/app/today" />
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Summary</span>
                <textarea
                  name="summary"
                  rows={3}
                  defaultValue={dashboard.dailyCheckin?.summary ?? ""}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Wins</span>
                <textarea
                  name="wins"
                  rows={3}
                  defaultValue={Array.isArray(dashboard.dailyCheckin?.wins)
                    ? dashboard.dailyCheckin?.wins.join("\n")
                    : ""}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Misses</span>
                <textarea
                  name="misses"
                  rows={3}
                  defaultValue={Array.isArray(dashboard.dailyCheckin?.misses)
                    ? dashboard.dailyCheckin?.misses.join("\n")
                    : ""}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Lessons</span>
                <textarea
                  name="lessons"
                  rows={3}
                  defaultValue={Array.isArray(dashboard.dailyCheckin?.lessons)
                    ? dashboard.dailyCheckin?.lessons.join("\n")
                    : ""}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
              <button
                type="submit"
                className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
              >
                Submit Daily Check-In
              </button>
            </form>
          </InfoCard>
        </div>
      </div>
    </SurfaceShell>
  );
}
