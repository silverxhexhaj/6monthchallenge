import { InfoCard } from "@/components/system/InfoCard";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getAdminAnnouncementsSnapshot } from "@/lib/supabase/queries/admin";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAdminAnnouncementsSnapshot();

  return (
    <SurfaceShell
      eyebrow="Founder Operations"
      title="Announcements."
      description="Member-visible broadcasts are surfaced here so founder messaging has an auditable home even before rich editor tooling exists."
    >
      <InfoCard
        title="Published And Draft Rows"
        description="Read visibility lands first. Rich authoring and notifications can follow after the core flows are stable."
      >
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-sm text-muted">No announcements have been created yet.</p>
          ) : null}
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border border-border p-4 text-sm text-muted">
              <p className="text-white">{announcement.title}</p>
              <p>{announcement.body}</p>
              <p className="mt-3 text-xs uppercase tracking-[3px]">
                {announcement.published_at
                  ? `Published ${new Date(announcement.published_at).toLocaleString()}`
                  : "Draft / unpublished"}
              </p>
            </div>
          ))}
        </div>
      </InfoCard>
    </SurfaceShell>
  );
}
