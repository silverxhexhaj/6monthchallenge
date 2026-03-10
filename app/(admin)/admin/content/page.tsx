import { InfoCard } from "@/components/system/InfoCard";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getAdminContentSnapshot } from "@/lib/supabase/queries/admin";

export default async function AdminContentPage() {
  const content = await getAdminContentSnapshot();

  return (
    <SurfaceShell
      eyebrow="Founder Operations"
      title="Content Operations."
      description="This founder view reads the seeded program structure directly from Supabase so static marketing content can be phased out safely."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard
          title={content.program?.title ?? "Program"}
          description={content.program?.description ?? "No program found."}
        >
          <div className="space-y-3 text-sm text-muted">
            <p>Slug: <span className="text-white">{content.program?.slug ?? "missing"}</span></p>
            <p>
              Duration:{" "}
              <span className="text-white">{content.program?.duration_days ?? 0} days</span>
            </p>
          </div>
        </InfoCard>
        <InfoCard
          title="Levels"
          description="Task and week counts are derived from the seeded templates."
        >
          <div className="space-y-4">
            {content.levels.map((level) => (
              <div key={level.id} className="border border-border p-4 text-sm text-muted">
                <p className="text-white">
                  Level {level.position}: {level.title}
                </p>
                <p>{level.tagline ?? "No tagline"}</p>
                <p>{level.task_count} task templates · {level.week_count} weeks</p>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
