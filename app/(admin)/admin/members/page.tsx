import { InfoCard } from "@/components/system/InfoCard";
import { StatusBadge } from "@/components/system/StatusBadge";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getAdminMembersSnapshot } from "@/lib/supabase/queries/admin";

export default async function AdminMembersPage() {
  const members = await getAdminMembersSnapshot();

  return (
    <SurfaceShell
      eyebrow="Founder Operations"
      title="Member Management."
      description="This founder view shows account state, onboarding progress, current level, and cohort attachment without needing direct database access."
    >
      <InfoCard
        title="Members"
        description="Mutations can follow later. This milestone focuses on visibility first."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-muted">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[3px]">
                <th className="py-3 pr-4">Member</th>
                <th className="py-3 pr-4">Account</th>
                <th className="py-3 pr-4">Enrollment</th>
                <th className="py-3 pr-4">Level</th>
                <th className="py-3 pr-4">Day</th>
                <th className="py-3 pr-4">Cohort</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-border/70">
                  <td className="py-4 pr-4">
                    <div className="text-white">{member.profile?.display_name ?? "Unknown"}</div>
                    <div className="text-xs uppercase tracking-[2px] text-muted">
                      {member.profile?.handle ?? member.profile?.timezone ?? "member"}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge tone={member.account_state === "active" ? "success" : "warning"}>
                      {member.account_state}
                    </StatusBadge>
                  </td>
                  <td className="py-4 pr-4">{member.enrollment_state}</td>
                  <td className="py-4 pr-4">
                    {member.current_level?.title ?? "Unassigned"}
                  </td>
                  <td className="py-4 pr-4">{member.current_day}</td>
                  <td className="py-4 pr-4">
                    {member.active_cohort?.name ?? "No cohort"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoCard>
    </SurfaceShell>
  );
}
