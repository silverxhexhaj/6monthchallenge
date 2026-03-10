import { updateMemberSettingsAction } from "@/app/(member)/actions";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getSettingsSnapshot } from "@/lib/supabase/queries/member";
import { requireMemberAppViewer } from "@/lib/supabase/queries/viewer";

interface SettingsPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const viewer = await requireMemberAppViewer();
  const [settings, params] = await Promise.all([
    getSettingsSnapshot(viewer),
    searchParams,
  ]);

  return (
    <SurfaceShell
      eyebrow="Member Settings"
      title="Settings And Preferences."
      description="Update your profile details, timezone, reminder settings, and public proof preferences."
    >
      <div className="mb-6 space-y-3">
        {params.message ? <MessageBanner message={params.message} /> : null}
        {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <InfoCard
          title="Profile"
          description="These details control how your account appears in the app."
        >
          <form action={updateMemberSettingsAction} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Display Name</span>
              <input
                type="text"
                name="displayName"
                defaultValue={settings.profile.display_name}
                required
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Handle</span>
              <input
                type="text"
                name="handle"
                defaultValue={settings.profile.handle ?? ""}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Timezone</span>
              <input
                type="text"
                name="timezone"
                defaultValue={settings.profile.timezone}
                className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 border border-border px-4 py-3 text-sm text-muted">
                <input
                  type="checkbox"
                  name="dailyReminderEnabled"
                  defaultChecked={
                    settings.notificationPreferences?.daily_reminder_enabled ?? true
                  }
                />
                Daily reminder enabled
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[3px] text-muted">Reminder Time</span>
                <input
                  type="time"
                  name="dailyReminderTime"
                  defaultValue={
                    settings.notificationPreferences?.daily_reminder_time ?? "07:00"
                  }
                  className="w-full border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
            </div>
            <label className="flex items-center gap-3 border border-border px-4 py-3 text-sm text-muted">
              <input
                type="checkbox"
                name="weeklyReviewReminderEnabled"
                defaultChecked={
                  settings.notificationPreferences?.weekly_review_reminder_enabled ??
                  true
                }
              />
              Weekly review reminder enabled
            </label>
            <label className="flex items-center gap-3 border border-border px-4 py-3 text-sm text-muted">
              <input
                type="checkbox"
                name="publicProfileEnabled"
                defaultChecked={settings.profile.public_profile_enabled}
              />
              Public profile and opt-in proof visibility enabled
            </label>
            <button
              type="submit"
              className="w-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-white"
            >
              Save Settings
            </button>
          </form>
        </InfoCard>
        <InfoCard
          title="Current Account"
          description="This is the state the member app is reading right now."
        >
          <div className="space-y-3 text-sm text-muted">
            <p>
              Role: <span className="text-white">{settings.profile.role}</span>
            </p>
            <p>
              Public profile:{" "}
              <span className="text-white">
                {settings.profile.public_profile_enabled ? "enabled" : "disabled"}
              </span>
            </p>
            <p>
              Reminder time:{" "}
              <span className="text-white">
                {settings.notificationPreferences?.daily_reminder_time ?? "not set"}
              </span>
            </p>
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
