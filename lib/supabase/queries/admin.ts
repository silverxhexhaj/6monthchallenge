import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];
type CohortRow = Database["public"]["Tables"]["cohorts"]["Row"];
type FounderUpdateRow = Database["public"]["Tables"]["founder_updates"]["Row"];
type LevelRow = Database["public"]["Tables"]["levels"]["Row"];
type MemberProgramRow = Database["public"]["Tables"]["member_programs"]["Row"];
type MemberStatusHistoryRow =
  Database["public"]["Tables"]["member_status_history"]["Row"];
type NotificationEventRow =
  Database["public"]["Tables"]["notification_events"]["Row"];
type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface AdminMemberRecord extends MemberProgramRow {
  profile: Pick<ProfileRow, "id" | "display_name" | "handle" | "role" | "timezone"> | null;
  current_level: Pick<LevelRow, "id" | "position" | "title"> | null;
  active_cohort: Pick<CohortRow, "id" | "name" | "slug" | "status"> | null;
}

export interface AdminOverviewSnapshot {
  memberCounts: {
    active: number;
    onboarding: number;
    paused: number;
    completed: number;
  };
  latestMembers: AdminMemberRecord[];
  cohorts: CohortRow[];
  announcements: AnnouncementRow[];
  founderUpdates: FounderUpdateRow[];
}

export interface AdminContentSnapshot {
  program: ProgramRow | null;
  levels: (LevelRow & { task_count: number; week_count: number })[];
}

export interface AdminOperationsSnapshot {
  statusHistory: MemberStatusHistoryRow[];
  notificationEvents: NotificationEventRow[];
  payments: PaymentRow[];
}

export async function getAdminOverviewSnapshot(): Promise<AdminOverviewSnapshot> {
  const supabase = await createSupabaseServiceRoleClient();
  const latestMembers = await getAdminMembersSnapshot(8);

  const [activeCount, onboardingCount, pausedCount, completedCount, cohorts, announcements, founderUpdates] =
    await Promise.all([
      getMemberCountByState("active"),
      getMemberCountByEnrollment("onboarding"),
      getMemberCountByState("paused"),
      getMemberCountByEnrollment("completed"),
      supabase.from("cohorts").select("*").order("starts_on", { ascending: false }).limit(4),
      supabase
        .from("announcements")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(4),
      supabase
        .from("founder_updates")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(4),
    ]);

  return {
    memberCounts: {
      active: activeCount,
      onboarding: onboardingCount,
      paused: pausedCount,
      completed: completedCount,
    },
    latestMembers,
    cohorts: (cohorts.data ?? []) as CohortRow[],
    announcements: (announcements.data ?? []) as AnnouncementRow[],
    founderUpdates: (founderUpdates.data ?? []) as FounderUpdateRow[],
  };
}

export async function getAdminMembersSnapshot(limit = 50) {
  const supabase = await createSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("member_programs")
    .select(
      `
        *,
        profile:profiles(id, display_name, handle, role, timezone),
        current_level:levels(id, position, title),
        active_cohort:cohorts(id, name, slug, status)
      `,
    )
    .order("updated_at", { ascending: false })
    .limit(limit);

  return (data as AdminMemberRecord[] | null) ?? [];
}

export async function getAdminCohortsSnapshot(): Promise<CohortRow[]> {
  const supabase = await createSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("cohorts")
    .select("*")
    .order("starts_on", { ascending: true });

  return (data ?? []) as CohortRow[];
}

export async function getAdminContentSnapshot(): Promise<AdminContentSnapshot> {
  const supabase = await createSupabaseServiceRoleClient();
  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", "6-month-challenge")
    .maybeSingle();

  const typedProgram = (program as ProgramRow | null) ?? null;

  if (!typedProgram) {
    return {
      program: null,
      levels: [],
    };
  }

  const [levels, taskTemplates, weeks] = await Promise.all([
    supabase
      .from("levels")
      .select("*")
      .eq("program_id", typedProgram.id)
      .order("position", { ascending: true }),
    supabase.from("daily_task_templates").select("level_id").eq("program_id", typedProgram.id),
    supabase.from("program_weeks").select("level_id").eq("program_id", typedProgram.id),
  ]);

  const taskCounts = new Map<string, number>();
  for (const task of (taskTemplates.data ?? []) as { level_id: string }[]) {
    taskCounts.set(task.level_id, (taskCounts.get(task.level_id) ?? 0) + 1);
  }

  const weekCounts = new Map<string, number>();
  for (const week of (weeks.data ?? []) as { level_id: string }[]) {
    weekCounts.set(week.level_id, (weekCounts.get(week.level_id) ?? 0) + 1);
  }

  return {
    program: typedProgram,
    levels:
      ((levels.data ?? []) as LevelRow[]).map((level) => ({
        ...level,
        task_count: taskCounts.get(level.id) ?? 0,
        week_count: weekCounts.get(level.id) ?? 0,
      })),
  };
}

export async function getAdminAnnouncementsSnapshot(): Promise<AnnouncementRow[]> {
  const supabase = await createSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("published_at", { ascending: false });

  return (data ?? []) as AnnouncementRow[];
}

export async function getAdminFounderUpdatesSnapshot(): Promise<FounderUpdateRow[]> {
  const supabase = await createSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("founder_updates")
    .select("*")
    .order("published_at", { ascending: false });

  return (data ?? []) as FounderUpdateRow[];
}

export async function getAdminOperationsSnapshot(): Promise<AdminOperationsSnapshot> {
  const supabase = await createSupabaseServiceRoleClient();
  const [statusHistory, notificationEvents, payments] = await Promise.all([
    supabase
      .from("member_status_history")
      .select("*")
      .order("changed_at", { ascending: false })
      .limit(12),
    supabase
      .from("notification_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  return {
    statusHistory: (statusHistory.data ?? []) as MemberStatusHistoryRow[],
    notificationEvents: (notificationEvents.data ?? []) as NotificationEventRow[],
    payments: (payments.data ?? []) as PaymentRow[],
  };
}

async function getMemberCountByState(
  state: Database["public"]["Enums"]["account_state"],
) {
  const supabase = await createSupabaseServiceRoleClient();
  const { count } = await supabase
    .from("member_programs")
    .select("*", { count: "exact", head: true })
    .eq("account_state", state);

  return count ?? 0;
}

async function getMemberCountByEnrollment(
  state: Database["public"]["Enums"]["enrollment_state"],
) {
  const supabase = await createSupabaseServiceRoleClient();
  const { count } = await supabase
    .from("member_programs")
    .select("*", { count: "exact", head: true })
    .eq("enrollment_state", state);

  return count ?? 0;
}
