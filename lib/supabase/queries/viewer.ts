import { redirect } from "next/navigation";
import {
  canAccessMemberApp,
  needsOnboarding,
  type AccountState,
  type EnrollmentState,
} from "@/lib/domain/entitlements";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type MemberProgramRow = Database["public"]["Tables"]["member_programs"]["Row"];
type NotificationPreferencesRow =
  Database["public"]["Tables"]["member_notification_preferences"]["Row"];
type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];
type LevelRow = Database["public"]["Tables"]["levels"]["Row"];
type CohortRow = Database["public"]["Tables"]["cohorts"]["Row"];

export interface ActiveMemberProgram extends MemberProgramRow {
  program: Pick<ProgramRow, "id" | "slug" | "title" | "duration_days"> | null;
  current_level: Pick<
    LevelRow,
    "id" | "position" | "title" | "tagline" | "start_day" | "end_day"
  > | null;
  active_cohort: Pick<
    CohortRow,
    | "id"
    | "name"
    | "slug"
    | "status"
    | "starts_on"
    | "ends_on"
    | "enrollment_opens_at"
    | "enrollment_closes_at"
  > | null;
}

export interface ViewerContext {
  profile: ProfileRow;
  memberProgram: ActiveMemberProgram | null;
  notificationPreferences: NotificationPreferencesRow | null;
}

export interface MemberAppViewerContext extends ViewerContext {
  memberProgram: ActiveMemberProgram;
}

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (profile as ProfileRow | null) ?? null;
}

export async function getActiveMemberProgram(
  profileId: string,
): Promise<ActiveMemberProgram | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("member_programs")
    .select(
      `
        *,
        program:programs(id, slug, title, duration_days),
        current_level:levels(id, position, title, tagline, start_day, end_day),
        active_cohort:cohorts(
          id,
          name,
          slug,
          status,
          starts_on,
          ends_on,
          enrollment_opens_at,
          enrollment_closes_at
        )
      `,
    )
    .eq("profile_id", profileId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as ActiveMemberProgram | null) ?? null;
}

export async function getViewerContext(): Promise<ViewerContext | null> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  const [memberProgram, notificationPreferences] = await Promise.all([
    getActiveMemberProgram(profile.id),
    getNotificationPreferences(profile.id),
  ]);

  return {
    profile,
    memberProgram,
    notificationPreferences,
  } satisfies ViewerContext;
}

export async function getNotificationPreferences(
  profileId: string,
): Promise<NotificationPreferencesRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("member_notification_preferences")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  return (data as NotificationPreferencesRow | null) ?? null;
}

export function getDefaultSignedInPath(viewer: ViewerContext) {
  if (viewer.profile.role === "founder_admin") {
    return "/admin";
  }

  if (
    !viewer.memberProgram ||
    isOnboardingIncomplete(viewer.memberProgram.account_state, viewer.memberProgram.enrollment_state) ||
    !viewer.memberProgram.primary_goal ||
    !viewer.memberProgram.rules_accepted_at
  ) {
    return "/onboarding";
  }

  if (
    canAccessMemberApp(
      viewer.memberProgram.account_state as AccountState,
      viewer.memberProgram.enrollment_state as EnrollmentState,
    )
  ) {
    return "/app";
  }

  return "/onboarding";
}

export async function requireViewerContext(): Promise<ViewerContext> {
  const viewer = await getViewerContext();

  if (!viewer) {
    redirect("/login");
  }

  return viewer;
}

export async function requireMemberRouteViewer(): Promise<ViewerContext> {
  const viewer = await requireViewerContext();

  if (viewer.profile.role === "founder_admin") {
    redirect("/admin");
  }

  return viewer;
}

export async function requireMemberAppViewer(): Promise<MemberAppViewerContext> {
  const viewer = await requireMemberRouteViewer();

  if (
    !viewer.memberProgram ||
    !viewer.memberProgram.primary_goal ||
    !viewer.memberProgram.rules_accepted_at ||
    !canAccessMemberApp(
      viewer.memberProgram.account_state as AccountState,
      viewer.memberProgram.enrollment_state as EnrollmentState,
    )
  ) {
    redirect("/onboarding");
  }

  return viewer as MemberAppViewerContext;
}

export async function requireAdminViewer(): Promise<ViewerContext> {
  const viewer = await requireViewerContext();

  if (viewer.profile.role !== "founder_admin") {
    redirect(getDefaultSignedInPath(viewer));
  }

  return viewer;
}

function isOnboardingIncomplete(accountState: AccountState, enrollmentState: EnrollmentState) {
  if (needsOnboarding(enrollmentState)) {
    return true;
  }

  return !canAccessMemberApp(accountState, enrollmentState);
}
