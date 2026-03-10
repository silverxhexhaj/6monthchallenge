import { submitMonthlyReviewAction } from "@/app/(member)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { StatusBadge } from "@/components/system/StatusBadge";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getDashboardSnapshot } from "@/lib/supabase/queries/member";
import { requireMemberAppViewer } from "@/lib/supabase/queries/viewer";

interface MonthlyReviewPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function MonthlyReviewPage({
  searchParams,
}: MonthlyReviewPageProps) {
  const viewer = await requireMemberAppViewer();
  const [dashboard, params] = await Promise.all([
    getDashboardSnapshot(viewer),
    searchParams,
  ]);

  return (
    <SurfaceShell
      eyebrow="Monthly Reviews"
      title="Monthly Reflection."
      description="Close the current level window with a review that captures the real outcome, not just the ideal story."
    >
      <div className="mb-6 space-y-3">
        {params.message ? <MessageBanner message={params.message} /> : null}
        {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <InfoCard
          title={viewer.memberProgram.current_level?.title ?? "Current Level"}
          description="This reflection becomes one of the main inputs to server-owned progression visibility."
        >
          <form action={submitMonthlyReviewAction} className="space-y-4">
            <input type="hidden" name="redirectTo" value="/app/reviews/monthly" />
            <input type="hidden" name="levelId" value={viewer.memberProgram.current_level_id ?? ""} />
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Summary</span>
              <textarea
                name="summary"
                rows={3}
                defaultValue={dashboard.monthlyReview?.summary ?? ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Wins</span>
              <textarea
                name="wins"
                rows={4}
                defaultValue={Array.isArray(dashboard.monthlyReview?.wins)
                  ? dashboard.monthlyReview?.wins.join("\n")
                  : ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Misses</span>
              <textarea
                name="misses"
                rows={4}
                defaultValue={Array.isArray(dashboard.monthlyReview?.misses)
                  ? dashboard.monthlyReview?.misses.join("\n")
                  : ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Lessons</span>
              <textarea
                name="lessons"
                rows={4}
                defaultValue={Array.isArray(dashboard.monthlyReview?.lessons)
                  ? dashboard.monthlyReview?.lessons.join("\n")
                  : ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Reflection</span>
              <textarea
                name="reflection"
                rows={5}
                defaultValue={
                  dashboard.monthlyReview?.reflection &&
                  typeof dashboard.monthlyReview.reflection === "object" &&
                  !Array.isArray(dashboard.monthlyReview.reflection)
                    ? String(dashboard.monthlyReview.reflection.reflection ?? "")
                    : ""
                }
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
            >
              Submit Monthly Review
            </button>
          </form>
        </InfoCard>
        <InfoCard
          title="Current State"
          description="The monthly review acts as the level-close checkpoint for the current milestone."
        >
          <div className="space-y-3 text-sm text-muted">
            <StatusBadge tone={dashboard.monthlyReview?.status === "submitted" ? "success" : "warning"}>
              {dashboard.monthlyReview?.status ?? "draft"}
            </StatusBadge>
            <p>
              Level:{" "}
              <span className="text-white">
                {viewer.memberProgram.current_level?.title ?? "No level loaded"}
              </span>
            </p>
            <p>
              Submitted at:{" "}
              <span className="text-white">
                {dashboard.monthlyReview?.submitted_at
                  ? new Date(dashboard.monthlyReview.submitted_at).toLocaleString()
                  : "Not submitted"}
              </span>
            </p>
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
