import { InfoCard } from "@/components/system/InfoCard";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getAdminFounderUpdatesSnapshot } from "@/lib/supabase/queries/admin";

export default async function AdminFounderUpdatesPage() {
  const updates = await getAdminFounderUpdatesSnapshot();

  return (
    <SurfaceShell
      eyebrow="Founder Operations"
      title="Founder Updates."
      description="Founder notes that feed the public journey and member dashboard are visible here, with public-vs-private state preserved."
    >
      <InfoCard
        title="Update Feed"
        description="The public journey can eventually move to this data source instead of static mock data."
      >
        <div className="space-y-4">
          {updates.length === 0 ? (
            <p className="text-sm text-muted">No founder updates have been published yet.</p>
          ) : null}
          {updates.map((update) => (
            <div key={update.id} className="border border-border p-4 text-sm text-muted">
              <p className="text-white">{update.title}</p>
              <p>{update.summary ?? "No summary stored."}</p>
              <p className="mt-3 text-xs uppercase tracking-[3px]">
                {update.visibility} ·{" "}
                {update.published_at
                  ? new Date(update.published_at).toLocaleString()
                  : "draft"}
              </p>
            </div>
          ))}
        </div>
      </InfoCard>
    </SurfaceShell>
  );
}
