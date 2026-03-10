export type DailyTaskStatus = "planned" | "completed" | "missed" | "skipped";

export interface DailyTaskSnapshot {
  id: string;
  title: string;
  status: DailyTaskStatus;
  proofRequired: boolean;
}

export function countCompletedTasks(tasks: DailyTaskSnapshot[]) {
  return tasks.filter((task) => task.status === "completed").length;
}

export function countMissedTasks(tasks: DailyTaskSnapshot[]) {
  return tasks.filter((task) => task.status === "missed").length;
}

export function getCompletionRate(tasks: DailyTaskSnapshot[]) {
  if (tasks.length === 0) {
    return 0;
  }

  return Math.round((countCompletedTasks(tasks) / tasks.length) * 100);
}
