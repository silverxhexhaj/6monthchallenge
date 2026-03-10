"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBaselineSnapshot,
  isOnboardingReady,
  normalizeSecondaryGoals,
} from "@/lib/domain/onboarding";
import { getCurrentProgramDay } from "@/lib/domain/programs";
import { toReviewItems } from "@/lib/domain/reviews";
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import { requireMemberAppViewer, requireMemberRouteViewer } from "@/lib/supabase/queries/viewer";
import type { Database } from "@/lib/supabase/database.types";

type CohortRow = Database["public"]["Tables"]["cohorts"]["Row"];
type DailyTaskTemplateRow =
  Database["public"]["Tables"]["daily_task_templates"]["Row"];
type LevelRow = Database["public"]["Tables"]["levels"]["Row"];
type MemberProgramRow = Database["public"]["Tables"]["member_programs"]["Row"];
type ProgramWeekRow = Database["public"]["Tables"]["program_weeks"]["Row"];
type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];
type ProofType = Database["public"]["Enums"]["proof_type"];
type TaskStatus = Database["public"]["Enums"]["task_status"];

export async function completeOnboardingAction(formData: FormData) {
  const viewer = await requireMemberRouteViewer();
  const primaryGoal = String(formData.get("primaryGoal") ?? "").trim();
  const secondaryGoals = normalizeSecondaryGoals(
    String(formData.get("secondaryGoals") ?? ""),
  );
  const startDate = String(formData.get("startDate") ?? "");
  const timezone = String(formData.get("timezone") ?? "UTC").trim() || "UTC";
  const dailyReminderEnabled = formData.get("dailyReminderEnabled") === "on";
  const dailyReminderTime = String(formData.get("dailyReminderTime") ?? "").trim();
  const rulesAccepted = formData.get("rulesAccepted") === "on";
  const hoursPerDay = Number(formData.get("hoursPerDay") ?? 0);
  const disciplineScore = Number(formData.get("disciplineScore") ?? 0);
  const baselineNotes = String(formData.get("baselineNotes") ?? "");
  const redirectTo = "/onboarding";

  const draft = {
    primaryGoal,
    secondaryGoals,
    baseline: createBaselineSnapshot(hoursPerDay, disciplineScore, baselineNotes),
    startDate,
    rulesAccepted,
    reminderTime: dailyReminderTime || undefined,
    timezone,
  };

  if (!isOnboardingReady(draft)) {
    redirect(withError(redirectTo, "Complete every required onboarding field."));
  }

  const today = getTodayIsoDate();
  if (startDate > today) {
    redirect(withError(redirectTo, "Start date must be today or earlier for this MVP flow."));
  }

  const serviceClient = await createSupabaseServiceRoleClient();
  const existingProgram = viewer.memberProgram;
  const program =
    existingProgram?.program ??
    (
      await serviceClient
        .from("programs")
        .select("id, slug, title, duration_days")
        .eq("slug", "6-month-challenge")
        .maybeSingle()
    ).data;

  const typedProgram = (program as Pick<
    ProgramRow,
    "id" | "slug" | "title" | "duration_days"
  > | null) ?? null;

  if (!typedProgram) {
    redirect(withError(redirectTo, "Program setup is missing in Supabase."));
  }

  const { data: levelOne } = await serviceClient
    .from("levels")
    .select("*")
    .eq("program_id", typedProgram.id)
    .eq("position", 1)
    .maybeSingle();

  const typedLevelOne = (levelOne as LevelRow | null) ?? null;

  if (!typedLevelOne) {
    redirect(withError(redirectTo, "Level setup is missing in Supabase."));
  }

  const { data: cohort } = await serviceClient
    .from("cohorts")
    .select("*")
    .eq("program_id", typedProgram.id)
    .order("starts_on", { ascending: true })
    .limit(1)
    .maybeSingle();

  const typedCohort = (cohort as CohortRow | null) ?? null;

  const programDay = Math.max(1, getCurrentProgramDay(startDate) || 1);
  const accountState = "active";
  const enrollmentState = "in_program";

  const { data: memberProgram, error: memberProgramError } = await serviceClient
    .from("member_programs")
    .upsert(
      {
        profile_id: viewer.profile.id,
        program_id: typedProgram.id,
        active_cohort_id: typedCohort?.id ?? null,
        account_state: accountState,
        enrollment_state: enrollmentState,
        start_date: startDate,
        activated_at: new Date().toISOString(),
        current_day: programDay,
        current_level_id: typedLevelOne.id,
        primary_goal: primaryGoal,
        secondary_goals: secondaryGoals,
        rules_accepted_at: new Date().toISOString(),
        baseline_snapshot: draft.baseline,
      },
      {
        onConflict: "profile_id,program_id",
      },
    )
    .select("*")
    .maybeSingle();

  const typedMemberProgram = (memberProgram as MemberProgramRow | null) ?? null;

  if (memberProgramError || !typedMemberProgram) {
    redirect(withError(redirectTo, "Unable to save onboarding right now."));
  }

  await serviceClient.from("member_notification_preferences").upsert(
    {
      profile_id: viewer.profile.id,
      daily_reminder_enabled: dailyReminderEnabled,
      daily_reminder_time: dailyReminderTime || null,
      weekly_review_reminder_enabled: true,
      timezone,
    },
    {
      onConflict: "profile_id",
    },
  );

  if (typedCohort?.id) {
    const { data: existingMembership } = await serviceClient
      .from("cohort_memberships")
      .select("id")
      .eq("cohort_id", typedCohort.id)
      .eq("profile_id", viewer.profile.id)
      .maybeSingle();

    if (!existingMembership) {
      await serviceClient.from("cohort_memberships").insert({
        cohort_id: typedCohort.id,
        profile_id: viewer.profile.id,
        member_program_id: typedMemberProgram.id,
      });
    }
  }

  await serviceClient.from("member_status_history").insert({
    profile_id: viewer.profile.id,
    from_state: existingProgram?.account_state ?? null,
    to_state: accountState,
    changed_by: viewer.profile.id,
    reason: "Onboarding completed in UI.",
  });

  await generateFirstWeekTasks(
    serviceClient,
    typedMemberProgram.id,
    typedProgram.id,
    typedLevelOne.id,
    startDate,
  );

  revalidatePath("/onboarding");
  revalidatePath("/app");
  revalidatePath("/app/today");
  redirect("/app?message=Onboarding complete.");
}

export async function updateTaskStatusAction(formData: FormData) {
  const viewer = await requireMemberAppViewer();
  const taskId = String(formData.get("taskId") ?? "");
  const status = String(formData.get("status") ?? "") as TaskStatus;
  const redirectTo = String(formData.get("redirectTo") ?? "/app/today");

  if (!taskId || !["planned", "completed", "missed", "skipped"].includes(status)) {
    redirect(withError(redirectTo, "Invalid task update."));
  }

  const supabase = await createSupabaseServerClient();
  const { data: task } = await supabase
    .from("member_daily_tasks")
    .select("*")
    .eq("id", taskId)
    .eq("member_program_id", viewer.memberProgram.id)
    .maybeSingle();

  if (!task) {
    redirect(withError(redirectTo, "Task not found."));
  }

  const now = new Date().toISOString();
  const updatePayload: Database["public"]["Tables"]["member_daily_tasks"]["Update"] = {
    status,
    completed_at: null,
    skipped_at: null,
    missed_at: null,
  };

  if (status === "completed") {
    updatePayload.completed_at = now;
  }

  if (status === "skipped") {
    updatePayload.skipped_at = now;
  }

  if (status === "missed") {
    updatePayload.missed_at = now;
  }

  const { error } = await supabase
    .from("member_daily_tasks")
    .update(updatePayload)
    .eq("id", taskId)
    .eq("member_program_id", viewer.memberProgram.id);

  if (error) {
    redirect(withError(redirectTo, error.message));
  }

  revalidatePath("/app");
  revalidatePath("/app/today");
  revalidatePath("/app/progress");
  redirect(withMessage(redirectTo, "Task updated."));
}

export async function createProofAction(formData: FormData) {
  const viewer = await requireMemberAppViewer();
  const redirectTo = String(formData.get("redirectTo") ?? "/app/proof");
  const type = String(formData.get("type") ?? "note") as ProofType;
  const label = String(formData.get("label") ?? "").trim();
  const textValue = String(formData.get("textValue") ?? "").trim();
  const numericValueRaw = String(formData.get("numericValue") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const memberDailyTaskId = String(formData.get("memberDailyTaskId") ?? "").trim();
  const visibility =
    formData.get("visibility") === "public_opt_in" ? "public_opt_in" : "private";

  if (!label || !["metric", "note", "link"].includes(type)) {
    redirect(withError(redirectTo, "Proof label and type are required."));
  }

  const supabase = await createSupabaseServerClient();
  const insertPayload: Database["public"]["Tables"]["proof_items"]["Insert"] = {
    member_program_id: viewer.memberProgram.id,
    profile_id: viewer.profile.id,
    member_daily_task_id: memberDailyTaskId || null,
    type,
    visibility,
    label,
  };

  if (type === "metric") {
    const numericValue = Number(numericValueRaw);

    if (!Number.isFinite(numericValue)) {
      redirect(withError(redirectTo, "Metric proof needs a numeric value."));
    }

    insertPayload.numeric_value = numericValue;
  }

  if (type === "note") {
    insertPayload.text_value = textValue;
  }

  if (type === "link") {
    insertPayload.url = url;
  }

  const { error } = await supabase.from("proof_items").insert(insertPayload);

  if (error) {
    redirect(withError(redirectTo, error.message));
  }

  revalidatePath("/app");
  revalidatePath("/app/today");
  revalidatePath("/app/proof");
  revalidatePath("/app/progress");
  redirect(withMessage(redirectTo, "Proof saved."));
}

export async function submitDailyCheckinAction(formData: FormData) {
  const viewer = await requireMemberAppViewer();
  const redirectTo = String(formData.get("redirectTo") ?? "/app/today");
  const summary = String(formData.get("summary") ?? "").trim();
  const wins = toReviewItems(String(formData.get("wins") ?? ""));
  const misses = toReviewItems(String(formData.get("misses") ?? ""));
  const lessons = toReviewItems(String(formData.get("lessons") ?? ""));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("daily_checkins").upsert(
    {
      member_program_id: viewer.memberProgram.id,
      checkin_date: getTodayIsoDate(),
      status: "submitted",
      summary,
      wins,
      misses,
      lessons,
      submitted_at: new Date().toISOString(),
      locked_at: null,
    },
    {
      onConflict: "member_program_id,checkin_date",
    },
  );

  if (error) {
    redirect(withError(redirectTo, error.message));
  }

  revalidatePath("/app");
  revalidatePath("/app/today");
  redirect(withMessage(redirectTo, "Daily check-in submitted."));
}

export async function submitWeeklyReviewAction(formData: FormData) {
  const viewer = await requireMemberAppViewer();
  const redirectTo = String(formData.get("redirectTo") ?? "/app/reviews/weekly");
  const programWeekId = String(formData.get("programWeekId") ?? "");
  const summary = String(formData.get("summary") ?? "").trim();
  const wins = toReviewItems(String(formData.get("wins") ?? ""));
  const misses = toReviewItems(String(formData.get("misses") ?? ""));
  const lessons = toReviewItems(String(formData.get("lessons") ?? ""));
  const nextWeekAdjustments = toReviewItems(
    String(formData.get("nextWeekAdjustments") ?? ""),
  );
  const score = Number(formData.get("score") ?? 0);

  if (!programWeekId) {
    redirect(withError(redirectTo, "Weekly review is missing its target week."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("weekly_reviews").upsert(
    {
      member_program_id: viewer.memberProgram.id,
      program_week_id: programWeekId,
      status: "submitted",
      summary,
      wins,
      misses,
      lessons,
      next_week_adjustments: nextWeekAdjustments,
      score: Number.isFinite(score) ? score : null,
      submitted_at: new Date().toISOString(),
      locked_at: null,
    },
    {
      onConflict: "member_program_id,program_week_id",
    },
  );

  if (error) {
    redirect(withError(redirectTo, error.message));
  }

  revalidatePath("/app");
  revalidatePath("/app/reviews/weekly");
  revalidatePath("/app/progress");
  redirect(withMessage(redirectTo, "Weekly review submitted."));
}

export async function submitMonthlyReviewAction(formData: FormData) {
  const viewer = await requireMemberAppViewer();
  const redirectTo = String(formData.get("redirectTo") ?? "/app/reviews/monthly");
  const levelId = String(formData.get("levelId") ?? "");
  const summary = String(formData.get("summary") ?? "").trim();
  const wins = toReviewItems(String(formData.get("wins") ?? ""));
  const misses = toReviewItems(String(formData.get("misses") ?? ""));
  const lessons = toReviewItems(String(formData.get("lessons") ?? ""));
  const reflection = String(formData.get("reflection") ?? "").trim();

  if (!levelId) {
    redirect(withError(redirectTo, "Monthly review is missing its target level."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("monthly_reviews").upsert(
    {
      member_program_id: viewer.memberProgram.id,
      level_id: levelId,
      status: "submitted",
      summary,
      wins,
      misses,
      lessons,
      reflection: {
        reflection,
      },
      submitted_at: new Date().toISOString(),
      locked_at: null,
    },
    {
      onConflict: "member_program_id,level_id",
    },
  );

  if (error) {
    redirect(withError(redirectTo, error.message));
  }

  revalidatePath("/app");
  revalidatePath("/app/reviews/monthly");
  revalidatePath("/app/progress");
  redirect(withMessage(redirectTo, "Monthly review submitted."));
}

export async function updateMemberSettingsAction(formData: FormData) {
  const viewer = await requireMemberAppViewer();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const handle = String(formData.get("handle") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "UTC").trim() || "UTC";
  const dailyReminderEnabled = formData.get("dailyReminderEnabled") === "on";
  const dailyReminderTime = String(formData.get("dailyReminderTime") ?? "").trim();
  const weeklyReviewReminderEnabled =
    formData.get("weeklyReviewReminderEnabled") === "on";
  const publicProfileEnabled = formData.get("publicProfileEnabled") === "on";
  const redirectTo = "/app/settings";

  if (!displayName) {
    redirect(withError(redirectTo, "Display name is required."));
  }

  const supabase = await createSupabaseServerClient();
  const [profileUpdate, preferenceUpdate] = await Promise.all([
    supabase
      .from("profiles")
      .update({
        display_name: displayName,
        handle: handle || null,
        timezone,
        public_profile_enabled: publicProfileEnabled,
      })
      .eq("id", viewer.profile.id),
    supabase.from("member_notification_preferences").upsert(
      {
        profile_id: viewer.profile.id,
        daily_reminder_enabled: dailyReminderEnabled,
        daily_reminder_time: dailyReminderTime || null,
        weekly_review_reminder_enabled: weeklyReviewReminderEnabled,
        timezone,
      },
      {
        onConflict: "profile_id",
      },
    ),
  ]);

  if (profileUpdate.error || preferenceUpdate.error) {
    redirect(
      withError(
        redirectTo,
        profileUpdate.error?.message ?? preferenceUpdate.error?.message ?? "Unable to update settings.",
      ),
    );
  }

  revalidatePath("/app/settings");
  redirect(withMessage(redirectTo, "Settings updated."));
}

async function generateFirstWeekTasks(
  supabase: Awaited<ReturnType<typeof createSupabaseServiceRoleClient>>,
  memberProgramId: string,
  programId: string,
  levelId: string,
  startDate: string,
) {
  const [{ data: templates }, { data: firstWeek }] = await Promise.all([
    supabase
      .from("daily_task_templates")
      .select("*")
      .eq("program_id", programId)
      .eq("level_id", levelId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("program_weeks")
      .select("*")
      .eq("program_id", programId)
      .eq("level_id", levelId)
      .order("week_number", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const typedTemplates = (templates as DailyTaskTemplateRow[] | null) ?? [];
  const typedFirstWeek = (firstWeek as ProgramWeekRow | null) ?? null;

  if (typedTemplates.length === 0) {
    return;
  }

  const taskRows: Database["public"]["Tables"]["member_daily_tasks"]["Insert"][] = [];

  for (let offset = 0; offset < 7; offset += 1) {
    const dueDate = addDays(startDate, offset);

    for (const template of typedTemplates) {
      taskRows.push({
        member_program_id: memberProgramId,
        daily_task_template_id: template.id,
        level_id: levelId,
        program_week_id: typedFirstWeek?.id ?? null,
        due_date: dueDate,
        title: template.title,
        description: template.description,
        proof_required: template.proof_required,
        same_day_editable_until: `${dueDate}T23:59:59.000Z`,
      });
    }
  }

  await supabase.from("member_daily_tasks").upsert(taskRows, {
    onConflict: "member_program_id,daily_task_template_id,due_date",
  });
}

function addDays(date: string, offset: number) {
  const baseDate = new Date(`${date}T00:00:00`);
  baseDate.setDate(baseDate.getDate() + offset);
  return baseDate.toISOString().slice(0, 10);
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function withMessage(path: string, message: string) {
  return `${path}?message=${encodeURIComponent(message)}`;
}

function withError(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}
