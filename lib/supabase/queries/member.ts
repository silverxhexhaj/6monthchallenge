import { evaluateUnlockProgress } from "@/lib/domain/progression";
import { getCurrentProgramDay } from "@/lib/domain/programs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { ActiveMemberProgram, ViewerContext } from "@/lib/supabase/queries/viewer";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];
type DailyCheckinRow = Database["public"]["Tables"]["daily_checkins"]["Row"];
type FounderUpdateRow = Database["public"]["Tables"]["founder_updates"]["Row"];
type LevelProgressRow = Database["public"]["Tables"]["level_progress"]["Row"];
type LevelRow = Database["public"]["Tables"]["levels"]["Row"];
type LevelUnlockRuleRow = Database["public"]["Tables"]["level_unlock_rules"]["Row"];
type MemberDailyTaskRow = Database["public"]["Tables"]["member_daily_tasks"]["Row"];
type MonthlyReviewRow = Database["public"]["Tables"]["monthly_reviews"]["Row"];
type ProgramWeekRow = Database["public"]["Tables"]["program_weeks"]["Row"];
type WeeklyReviewRow = Database["public"]["Tables"]["weekly_reviews"]["Row"];

export interface DashboardSnapshot {
  programDay: number;
  currentWeek: ProgramWeekRow | null;
  todayTasks: MemberDailyTaskRow[];
  dailyCheckin: DailyCheckinRow | null;
  weeklyReview: WeeklyReviewRow | null;
  monthlyReview: MonthlyReviewRow | null;
  founderUpdate: FounderUpdateRow | null;
  announcement: AnnouncementRow | null;
}

export interface ProgressSnapshot {
  currentLevel: LevelRow | null;
  currentRule: LevelUnlockRuleRow | null;
  levelHistory: LevelProgressRow[];
  completedDays: number;
  missedDays: number;
  proofCount: number;
  weeklyReviewsSubmitted: number;
  monthlyReviewSubmitted: boolean;
  unlockChecklist: {
    completedDaysMet: boolean;
    weeklyReviewsMet: boolean;
    monthlyReviewMet: boolean;
    missedDaysMet: boolean;
  } | null;
}

export async function getTodayTasks(
  memberProgramId: string,
  date = getTodayIsoDate(),
): Promise<MemberDailyTaskRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("member_daily_tasks")
    .select("*")
    .eq("member_program_id", memberProgramId)
    .eq("due_date", date)
    .order("created_at", { ascending: true });

  return (data ?? []) as MemberDailyTaskRow[];
}

export async function getWeeklyReviewState(
  memberProgramId: string,
  programWeekId: string | null,
): Promise<WeeklyReviewRow | null> {
  if (!programWeekId) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("weekly_reviews")
    .select("*")
    .eq("member_program_id", memberProgramId)
    .eq("program_week_id", programWeekId)
    .maybeSingle();

  return (data as WeeklyReviewRow | null) ?? null;
}

export async function getMonthlyReviewState(
  memberProgramId: string,
  levelId: string | null,
): Promise<MonthlyReviewRow | null> {
  if (!levelId) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("monthly_reviews")
    .select("*")
    .eq("member_program_id", memberProgramId)
    .eq("level_id", levelId)
    .maybeSingle();

  return (data as MonthlyReviewRow | null) ?? null;
}

export async function getProofHistory(memberProgramId: string): Promise<
  Database["public"]["Tables"]["proof_items"]["Row"][]
> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("proof_items")
    .select("*")
    .eq("member_program_id", memberProgramId)
    .order("created_at", { ascending: false })
    .limit(24);

  return (data ?? []) as Database["public"]["Tables"]["proof_items"]["Row"][];
}

export async function getDashboardSnapshot(viewer: ViewerContext): Promise<DashboardSnapshot> {
  if (!viewer.memberProgram) {
    return {
      programDay: 0,
      currentWeek: null,
      todayTasks: [],
      dailyCheckin: null,
      weeklyReview: null,
      monthlyReview: null,
      founderUpdate: null,
      announcement: null,
    };
  }

  const programDay = getResolvedProgramDay(viewer.memberProgram);
  const currentWeek = await getCurrentProgramWeek(viewer.memberProgram.program_id, programDay);

  const [todayTasks, dailyCheckin, weeklyReview, monthlyReview, founderUpdate, announcement] =
    await Promise.all([
      getTodayTasks(viewer.memberProgram.id),
      getDailyCheckin(viewer.memberProgram.id),
      getWeeklyReviewState(viewer.memberProgram.id, currentWeek?.id ?? null),
      getMonthlyReviewState(
        viewer.memberProgram.id,
        viewer.memberProgram.current_level_id,
      ),
      getLatestFounderUpdate(),
      getLatestAnnouncement(viewer.memberProgram.active_cohort_id),
    ]);

  return {
    programDay,
    currentWeek,
    todayTasks,
    dailyCheckin,
    weeklyReview,
    monthlyReview,
    founderUpdate,
    announcement,
  };
}

export async function getProgressSnapshot(
  memberProgram: ActiveMemberProgram,
): Promise<ProgressSnapshot> {
  const currentLevel = await getCurrentLevel(
    memberProgram.program_id,
    getResolvedProgramDay(memberProgram),
  );

  const [levelHistory, currentRule, levelTasks, weeklyReviewCount, monthlyReview, proofCount] =
    await Promise.all([
      getLevelProgressHistory(memberProgram.id),
      currentLevel ? getCurrentRule(currentLevel.id) : Promise.resolve(null),
      currentLevel ? getCurrentLevelTasks(memberProgram.id, currentLevel.id) : Promise.resolve([]),
      getSubmittedWeeklyReviewCount(memberProgram.id),
      currentLevel ? getMonthlyReviewState(memberProgram.id, currentLevel.id) : Promise.resolve(null),
      getProofCount(memberProgram.id),
    ]);

  const taskDays = new Map<string, MemberDailyTaskRow[]>();
  for (const task of levelTasks) {
    const existing = taskDays.get(task.due_date) ?? [];
    existing.push(task);
    taskDays.set(task.due_date, existing);
  }

  let completedDays = 0;
  let missedDays = 0;

  for (const dayTasks of taskDays.values()) {
    if (dayTasks.every((task) => task.status === "completed")) {
      completedDays += 1;
    }

    if (dayTasks.some((task) => task.status === "missed")) {
      missedDays += 1;
    }
  }

  const monthlyReviewSubmitted = monthlyReview?.status === "submitted";
  const unlockChecklist =
    currentRule && currentLevel
      ? evaluateUnlockProgress(
          {
            currentLevel: currentLevel.position,
            completedDays,
            missedDays,
            weeklyReviewsSubmitted: weeklyReviewCount,
            monthlyReviewSubmitted,
          },
          {
            minimumCompletedDays: currentRule.minimum_completed_days,
            minimumWeeklyReviewsSubmitted:
              currentRule.minimum_weekly_reviews_submitted,
            monthlyReviewRequired: currentRule.monthly_review_required,
            maximumMissedDays: currentRule.maximum_missed_days,
          },
        )
      : null;

  return {
    currentLevel,
    currentRule,
    levelHistory,
    completedDays,
    missedDays,
    proofCount,
    weeklyReviewsSubmitted: weeklyReviewCount,
    monthlyReviewSubmitted,
    unlockChecklist,
  };
}

export async function getSettingsSnapshot(viewer: ViewerContext) {
  return {
    profile: viewer.profile,
    notificationPreferences: viewer.notificationPreferences,
  };
}

async function getDailyCheckin(
  memberProgramId: string,
  date = getTodayIsoDate(),
): Promise<DailyCheckinRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("member_program_id", memberProgramId)
    .eq("checkin_date", date)
    .maybeSingle();

  return (data as DailyCheckinRow | null) ?? null;
}

async function getCurrentProgramWeek(
  programId: string,
  day: number,
): Promise<ProgramWeekRow | null> {
  if (day <= 0) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("program_weeks")
    .select("*")
    .eq("program_id", programId)
    .lte("start_day", day)
    .gte("end_day", day)
    .order("week_number", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (data as ProgramWeekRow | null) ?? null;
}

async function getCurrentLevel(
  programId: string,
  day: number,
): Promise<LevelRow | null> {
  if (day <= 0) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("levels")
    .select("*")
    .eq("program_id", programId)
    .lte("start_day", day)
    .gte("end_day", day)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (data as LevelRow | null) ?? null;
}

async function getCurrentRule(levelId: string): Promise<LevelUnlockRuleRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("level_unlock_rules")
    .select("*")
    .eq("level_id", levelId)
    .maybeSingle();

  return (data as LevelUnlockRuleRow | null) ?? null;
}

async function getCurrentLevelTasks(
  memberProgramId: string,
  levelId: string,
): Promise<MemberDailyTaskRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("member_daily_tasks")
    .select("*")
    .eq("member_program_id", memberProgramId)
    .eq("level_id", levelId)
    .order("due_date", { ascending: true });

  return (data ?? []) as MemberDailyTaskRow[];
}

async function getSubmittedWeeklyReviewCount(memberProgramId: string) {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("weekly_reviews")
    .select("*", { count: "exact", head: true })
    .eq("member_program_id", memberProgramId)
    .eq("status", "submitted");

  return count ?? 0;
}

async function getProofCount(memberProgramId: string) {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("proof_items")
    .select("*", { count: "exact", head: true })
    .eq("member_program_id", memberProgramId);

  return count ?? 0;
}

async function getLevelProgressHistory(
  memberProgramId: string,
): Promise<LevelProgressRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("level_progress")
    .select("*")
    .eq("member_program_id", memberProgramId)
    .order("created_at", { ascending: false });

  return (data ?? []) as LevelProgressRow[];
}

async function getLatestFounderUpdate(): Promise<FounderUpdateRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("founder_updates")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as FounderUpdateRow | null) ?? null;
}

async function getLatestAnnouncement(
  cohortId: string | null,
): Promise<AnnouncementRow | null> {
  const supabase = await createSupabaseServerClient();
  const query = supabase
    .from("announcements")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(1);

  if (cohortId) {
    const { data } = await query.or(`cohort_id.is.null,cohort_id.eq.${cohortId}`).maybeSingle();
    return (data as AnnouncementRow | null) ?? null;
  }

  const { data } = await query.is("cohort_id", null).maybeSingle();
  return (data as AnnouncementRow | null) ?? null;
}

function getResolvedProgramDay(memberProgram: ActiveMemberProgram) {
  return Math.max(
    memberProgram.current_day,
    getCurrentProgramDay(memberProgram.start_date),
  );
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
