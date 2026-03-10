import { createProofAction } from "@/app/(member)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { StatusBadge } from "@/components/system/StatusBadge";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getProofHistory } from "@/lib/supabase/queries/member";
import { requireMemberAppViewer } from "@/lib/supabase/queries/viewer";

interface ProofPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function ProofPage({ searchParams }: ProofPageProps) {
  const viewer = await requireMemberAppViewer();
  const [proofItems, params] = await Promise.all([
    getProofHistory(viewer.memberProgram.id),
    searchParams,
  ]);

  return (
    <SurfaceShell
      eyebrow="Proof Logging"
      title="Proof History And New Entries."
      description="Capture note, metric, or link proof and review the most recent entries tied to your challenge progress."
    >
      <div className="mb-6 space-y-3">
        {params.message ? <MessageBanner message={params.message} /> : null}
        {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <InfoCard
          title="Add Proof"
          description="Images can follow later. For now, use note, metric, and link proof."
        >
          <form action={createProofAction} className="space-y-4">
            <input type="hidden" name="redirectTo" value="/app/proof" />
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
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Text Value</span>
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
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">URL</span>
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
          title="Recent Proof"
          description="Newest entries appear first. Visibility stays private unless you explicitly opt in."
        >
          <div className="space-y-4">
            {proofItems.length === 0 ? (
              <p className="text-sm text-muted">No proof has been logged yet.</p>
            ) : null}
            {proofItems.map((proof) => (
              <div key={proof.id} className="border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bebas text-2xl tracking-[1px] text-white">{proof.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge tone="neutral">{proof.type}</StatusBadge>
                    <StatusBadge tone={proof.visibility === "private" ? "warning" : "success"}>
                      {proof.visibility === "private" ? "private" : "public"}
                    </StatusBadge>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-[1.7] text-muted">
                  {proof.text_value ??
                    proof.numeric_value?.toString() ??
                    proof.url ??
                    "No preview available."}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[3px] text-muted">
                  {new Date(proof.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
