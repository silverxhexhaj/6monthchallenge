import { submitWeeklyReviewAction } from "@/app/(member)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { StatusBadge } from "@/components/system/StatusBadge";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getDashboardSnapshot } from "@/lib/supabase/queries/member";
import { requireMemberAppViewer } from "@/lib/supabase/queries/viewer";

interface WeeklyReviewPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function WeeklyReviewPage({
  searchParams,
}: WeeklyReviewPageProps) {
  const viewer = await requireMemberAppViewer();
  const [dashboard, params] = await Promise.all([
    getDashboardSnapshot(viewer),
    searchParams,
  ]);

  return (
    <SurfaceShell
      eyebrow="Weekly Reviews"
      title="Weekly Scorecard."
      description="Submit a clear review for the current week so the progression engine and founder view stay grounded in real execution."
    >
      <div className="mb-6 space-y-3">
        {params.message ? <MessageBanner message={params.message} /> : null}
        {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <InfoCard
          title={dashboard.currentWeek?.title ?? "Current Week"}
          description="One line per item works well for wins, misses, lessons, and next-week adjustments."
        >
          <form action={submitWeeklyReviewAction} className="space-y-4">
            <input type="hidden" name="redirectTo" value="/app/reviews/weekly" />
            <input type="hidden" name="programWeekId" value={dashboard.currentWeek?.id ?? ""} />
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Summary</span>
              <textarea
                name="summary"
                rows={3}
                defaultValue={dashboard.weeklyReview?.summary ?? ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Wins</span>
              <textarea
                name="wins"
                rows={4}
                defaultValue={Array.isArray(dashboard.weeklyReview?.wins)
                  ? dashboard.weeklyReview?.wins.join("\n")
                  : ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Misses</span>
              <textarea
                name="misses"
                rows={4}
                defaultValue={Array.isArray(dashboard.weeklyReview?.misses)
                  ? dashboard.weeklyReview?.misses.join("\n")
                  : ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Lessons</span>
              <textarea
                name="lessons"
                rows={4}
                defaultValue={Array.isArray(dashboard.weeklyReview?.lessons)
                  ? dashboard.weeklyReview?.lessons.join("\n")
                  : ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Next Week Adjustments</span>
              <textarea
                name="nextWeekAdjustments"
                rows={4}
                defaultValue={Array.isArray(dashboard.weeklyReview?.next_week_adjustments)
                  ? dashboard.weeklyReview?.next_week_adjustments.join("\n")
                  : ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Score</span>
              <input
                type="number"
                name="score"
                min={1}
                max={10}
                defaultValue={dashboard.weeklyReview?.score ?? ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
            >
              Submit Weekly Review
            </button>
          </form>
        </InfoCard>
        <InfoCard
          title="Current State"
          description="The review status below is stored independently from the rest of the dashboard."
        >
          <div className="space-y-3 text-sm text-muted">
            <StatusBadge tone={dashboard.weeklyReview?.status === "submitted" ? "success" : "warning"}>
              {dashboard.weeklyReview?.status ?? "draft"}
            </StatusBadge>
            <p>
              Current week:{" "}
              <span className="text-white">
                {dashboard.currentWeek?.title ?? "No week available yet"}
              </span>
            </p>
            <p>
              Submitted at:{" "}
              <span className="text-white">
                {dashboard.weeklyReview?.submitted_at
                  ? new Date(dashboard.weeklyReview.submitted_at).toLocaleString()
                  : "Not submitted"}
              </span>
            </p>
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
