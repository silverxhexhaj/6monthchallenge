import { InfoCard } from "@/components/system/InfoCard";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getAdminCohortsSnapshot } from "@/lib/supabase/queries/admin";

export default async function AdminCohortsPage() {
  const cohorts = await getAdminCohortsSnapshot();

  return (
    <SurfaceShell
      eyebrow="Founder Operations"
      title="Cohort Visibility."
      description="Enrollment windows, timing, and external community links are surfaced here so founder operations stay readable."
    >
      <InfoCard
        title="Cohorts"
        description="This milestone keeps the screen read-heavy while the rest of the member flow is being stabilized."
      >
        <div className="space-y-4">
          {cohorts.map((cohort) => (
            <div key={cohort.id} className="border border-border p-4 text-sm text-muted">
              <p className="text-white">{cohort.name}</p>
              <p>{cohort.status} · starts {cohort.starts_on}</p>
              <p>
                Enrollment: {cohort.enrollment_opens_at ?? "not set"} to{" "}
                {cohort.enrollment_closes_at ?? "not set"}
              </p>
              <p>Community link: {cohort.external_community_url ?? "not set"}</p>
            </div>
          ))}
        </div>
      </InfoCard>
    </SurfaceShell>
  );
}
