import { redirect } from "next/navigation";
import { completeOnboardingAction } from "@/app/(member)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { canAccessMemberApp } from "@/lib/domain/entitlements";
import { requireMemberRouteViewer } from "@/lib/supabase/queries/viewer";

interface OnboardingPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const [viewer, params] = await Promise.all([requireMemberRouteViewer(), searchParams]);

  if (
    viewer.memberProgram &&
    viewer.memberProgram.primary_goal &&
    viewer.memberProgram.rules_accepted_at &&
    canAccessMemberApp(
      viewer.memberProgram.account_state,
      viewer.memberProgram.enrollment_state,
    )
  ) {
    redirect("/app");
  }

  return (
    <SurfaceShell
      eyebrow="Member Activation"
      title="Initialize Your Challenge System."
      description="Lock in your mission, baseline, start date, and reminder settings. Once this is complete, the app will generate your first active week."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <InfoCard
          title="Mission Setup"
          description="The MVP assumes a same-day start so the dashboard and today flow are immediately usable."
        >
          <form action={completeOnboardingAction} className="space-y-5">
            {params.message ? <MessageBanner message={params.message} /> : null}
            {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Primary Goal</span>
              <textarea
                name="primaryGoal"
                required
                rows={3}
                defaultValue={viewer.memberProgram?.primary_goal ?? ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Secondary Goals</span>
              <textarea
                name="secondaryGoals"
                rows={4}
                placeholder="One goal per line"
                defaultValue={Array.isArray(viewer.memberProgram?.secondary_goals)
                  ? viewer.memberProgram?.secondary_goals.join("\n")
                  : ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Start Date</span>
                <input
                  type="date"
                  name="startDate"
                  required
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Timezone</span>
                <input
                  type="text"
                  name="timezone"
                  defaultValue={
                    viewer.notificationPreferences?.timezone ?? viewer.profile.timezone
                  }
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Focused Hours Per Day</span>
                <input
                  type="number"
                  name="hoursPerDay"
                  min={1}
                  max={16}
                  defaultValue={2}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Discipline Score</span>
                <input
                  type="number"
                  name="disciplineScore"
                  min={1}
                  max={10}
                  defaultValue={5}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Baseline Notes</span>
              <textarea
                name="baselineNotes"
                rows={4}
                placeholder="Where are you starting from today?"
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 border border-border px-4 py-3 text-sm text-muted">
                <input
                  type="checkbox"
                  name="dailyReminderEnabled"
                  defaultChecked={viewer.notificationPreferences?.daily_reminder_enabled ?? true}
                />
                Daily email reminder
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Reminder Time</span>
                <input
                  type="time"
                  name="dailyReminderTime"
                  defaultValue={viewer.notificationPreferences?.daily_reminder_time ?? "07:00"}
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
                />
              </label>
            </div>
            <label className="flex items-start gap-3 border border-border px-4 py-4 text-sm text-muted">
              <input type="checkbox" name="rulesAccepted" required className="mt-1" />
              <span>
                I accept the 180-day rules, understand progression is server-owned, and want the app
                to generate my first week right now.
              </span>
            </label>
            <button
              type="submit"
              className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
            >
              Complete Onboarding
            </button>
          </form>
        </InfoCard>
        <InfoCard
          title="What Happens Next"
          description="This is the first real persistence step in the member app."
        >
          <ul className="space-y-3 text-sm leading-[1.8] text-muted">
            <li>Your active member program is created or updated.</li>
            <li>Your reminder preferences are saved.</li>
            <li>Your first week of tasks is generated from seeded templates.</li>
            <li>You are redirected into the dashboard and today flow.</li>
          </ul>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
