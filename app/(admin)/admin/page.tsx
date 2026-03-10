import { InfoCard } from "@/components/system/InfoCard";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getAdminOverviewSnapshot } from "@/lib/supabase/queries/admin";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverviewSnapshot();

  return (
    <SurfaceShell
      eyebrow="Founder Operations"
      title="Founder Admin Overview."
      description="This route gives the founder one operational surface for member health, cohort visibility, announcements, and the latest program movement."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <InfoCard title="Members" description="Current member counts by state.">
          <div className="space-y-2 text-sm text-muted">
            <p>Active: <span className="text-white">{overview.memberCounts.active}</span></p>
            <p>Onboarding: <span className="text-white">{overview.memberCounts.onboarding}</span></p>
            <p>Paused: <span className="text-white">{overview.memberCounts.paused}</span></p>
            <p>Completed: <span className="text-white">{overview.memberCounts.completed}</span></p>
          </div>
        </InfoCard>
        <InfoCard title="Cohorts" description="Upcoming and active cohort visibility.">
          <div className="space-y-3 text-sm text-muted">
            {overview.cohorts.length === 0 ? (
              <p>No cohorts seeded yet.</p>
            ) : (
              overview.cohorts.map((cohort) => (
                <div key={cohort.id}>
                  <p className="text-white">{cohort.name}</p>
                  <p>{cohort.status} · starts {cohort.starts_on}</p>
                </div>
              ))
            )}
          </div>
        </InfoCard>
        <InfoCard title="Broadcasts" description="Latest announcements and founder updates.">
          <div className="space-y-3 text-sm text-muted">
            <p>
              Announcements:{" "}
              <span className="text-white">{overview.announcements.length}</span>
            </p>
            <p>
              Founder updates:{" "}
              <span className="text-white">{overview.founderUpdates.length}</span>
            </p>
          </div>
        </InfoCard>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <InfoCard
          title="Latest Members"
          description="Recent member program records are surfaced here first for quick founder triage."
        >
          <div className="space-y-4">
            {overview.latestMembers.map((member) => (
              <div key={member.id} className="border border-border p-4 text-sm text-muted">
                <p className="text-white">{member.profile?.display_name ?? "Unknown member"}</p>
                <p>
                  {member.account_state} · {member.enrollment_state} · day {member.current_day}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
        <InfoCard
          title="Latest Updates"
          description="The most recent published founder notes are visible without leaving overview."
        >
          <div className="space-y-4">
            {overview.founderUpdates.map((update) => (
              <div key={update.id} className="border border-border p-4 text-sm text-muted">
                <p className="text-white">{update.title}</p>
                <p>{update.summary ?? "No summary saved."}</p>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
