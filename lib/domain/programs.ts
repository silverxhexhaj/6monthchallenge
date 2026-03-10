export interface ProgramSummary {
  slug: string;
  title: string;
  durationDays: number;
  levelCount: number;
}

export const sixMonthChallengeProgram: ProgramSummary = {
  slug: "6-month-challenge",
  title: "6-Month Challenge",
  durationDays: 180,
  levelCount: 6,
};

export interface LevelSummary {
  id: string;
  position: number;
  title: string;
  tagline: string | null;
  startDay: number;
  endDay: number;
}

export interface ProgramWeekSummary {
  id: string;
  weekNumber: number;
  title: string;
  startDay: number;
  endDay: number;
  levelId: string;
}

export function clampProgramDay(day: number) {
  return Math.min(Math.max(day, 1), sixMonthChallengeProgram.durationDays);
}

export function getCurrentProgramDay(startDate: string | null, now = new Date()) {
  if (!startDate) {
    return 0;
  }

  const start = new Date(`${startDate}T00:00:00`);
  const diffInDays = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;

  if (diffInDays <= 0) {
    return 0;
  }

  return clampProgramDay(diffInDays);
}

export function getLevelForDay(levels: LevelSummary[], day: number) {
  if (levels.length === 0 || day <= 0) {
    return null;
  }

  return (
    levels.find((level) => day >= level.startDay && day <= level.endDay) ??
    levels[levels.length - 1] ??
    null
  );
}

export function getWeekForDay(weeks: ProgramWeekSummary[], day: number) {
  if (weeks.length === 0 || day <= 0) {
    return null;
  }

  return weeks.find((week) => day >= week.startDay && day <= week.endDay) ?? null;
}
