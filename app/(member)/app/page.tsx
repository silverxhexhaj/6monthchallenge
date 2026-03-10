import Link from "next/link";
import { countCompletedTasks, getCompletionRate } from "@/lib/domain/daily-execution";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { StatusBadge } from "@/components/system/StatusBadge";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getDashboardSnapshot } from "@/lib/supabase/queries/member";
import { requireMemberAppViewer } from "@/lib/supabase/queries/viewer";

interface MemberDashboardPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function MemberDashboardPage({
  searchParams,
}: MemberDashboardPageProps) {
  const [viewer, dashboard, params] = await Promise.all([
    requireMemberAppViewer(),
    requireMemberAppViewer().then(getDashboardSnapshot),
    searchParams,
  ]);

  const completedTasks = countCompletedTasks(
    dashboard.todayTasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      proofRequired: task.proof_required,
    })),
  );

  return (
    <SurfaceShell
      eyebrow="Member Dashboard"
      title="Your Challenge Operating System."
      description="This is the main home for current day, level progress, today&apos;s work, review deadlines, and founder guidance."
    >
      <div className="mb-6 space-y-3">
        {params.message ? <MessageBanner message={params.message} /> : null}
        {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <InfoCard
          title="Current State"
          description={`Day ${dashboard.programDay} of ${
            viewer.memberProgram.program?.duration_days ?? 180
          }`}
        >
          <div className="space-y-3 text-sm text-muted">
            <div>
              <StatusBadge tone="success">
                {viewer.memberProgram.current_level?.title ?? "Level loading"}
              </StatusBadge>
            </div>
            <p>
              Goal: <span className="text-white">{viewer.memberProgram.primary_goal}</span>
            </p>
            <p>
              Cohort:{" "}
              <span className="text-white">
                {viewer.memberProgram.active_cohort?.name ?? "Independent start"}
              </span>
            </p>
          </div>
        </InfoCard>
        <InfoCard
          title="Today"
          description={`${completedTasks}/${dashboard.todayTasks.length} tasks complete today.`}
        >
          <div className="space-y-3 text-sm text-muted">
            <p>Completion rate: {getCompletionRate(
              dashboard.todayTasks.map((task) => ({
                id: task.id,
                title: task.title,
                status: task.status,
                proofRequired: task.proof_required,
              })),
            )}%</p>
            <p>
              Daily check-in:{" "}
              <span className="text-white">
                {dashboard.dailyCheckin?.status ?? "not started"}
              </span>
            </p>
            <Link
              href="/app/today"
              className="inline-block bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black no-underline"
            >
              Open Today Flow
            </Link>
          </div>
        </InfoCard>
        <InfoCard
          title="Accountability"
          description="Reviews and founder updates stay visible here so nothing drifts."
        >
          <div className="space-y-3 text-sm text-muted">
            <p>
              Weekly review:{" "}
              <span className="text-white">{dashboard.weeklyReview?.status ?? "draft"}</span>
            </p>
            <p>
              Monthly review:{" "}
              <span className="text-white">{dashboard.monthlyReview?.status ?? "draft"}</span>
            </p>
            <p>
              Founder update:{" "}
              <span className="text-white">
                {dashboard.founderUpdate?.title ?? "No published update yet"}
              </span>
            </p>
          </div>
        </InfoCard>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <InfoCard
          title="Latest Founder Update"
          description={dashboard.founderUpdate?.summary ?? "No summary available yet."}
        >
          <p className="text-sm leading-[1.8] text-muted">
            {dashboard.founderUpdate?.body ?? "Founder updates will appear here as they are published."}
          </p>
        </InfoCard>
        <InfoCard
          title="Announcement"
          description={dashboard.announcement?.title ?? "No active announcement right now."}
        >
          <p className="text-sm leading-[1.8] text-muted">
            {dashboard.announcement?.body ?? "Program and cohort announcements will appear here."}
          </p>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
