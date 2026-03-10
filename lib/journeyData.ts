// Data types are intentionally reusable as the future model for any user profile.
// When multi-user support lands, `ProgressProfile` becomes the per-user document
// fetched from the database, and `founderProfile` becomes one row of that table.

export type EntryType = "daily" | "weekly" | "monthly";

export type ProofItemType = "metric" | "note";

export interface ProofItem {
  type: ProofItemType;
  label: string;
  value: string;
}

export interface CheckIn {
  id: string;
  date: string; // ISO 8601 date string, e.g. "2026-03-10"
  type: EntryType;
  title: string;
  summary: string;
  wins: string[];
  misses: string[];
  lessons: string[];
  proofItems?: ProofItem[];
  xPostUrl?: string;
}

export interface ProgressProfile {
  id: string;
  name: string;
  handle: string;
  xUrl: string;
  currentLevel: number; // 1–6
  startDate: string; // ISO 8601
  entries: CheckIn[];
}

// Level metadata mirrors the Tracker component so both stay in sync
export const LEVELS = [
  { num: 1, label: "Level One", month: "Month 1", focus: "Command Time", color: "text-phase1", border: "border-phase1" },
  { num: 2, label: "Level Two", month: "Month 2", focus: "Forge Discipline", color: "text-phase2", border: "border-phase2" },
  { num: 3, label: "Level Three", month: "Month 3", focus: "Raise Standards", color: "text-phase3", border: "border-phase3" },
  { num: 4, label: "Level Four", month: "Month 4", focus: "Fortress Mind", color: "text-phase4", border: "border-phase4" },
  { num: 5, label: "Level Five", month: "Month 5", focus: "Full Execution", color: "text-phase5", border: "border-phase5" },
  { num: 6, label: "Level Six", month: "Month 6", focus: "Unstoppable", color: "text-accent", border: "border-accent" },
] as const;

export function daysSinceStart(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.max(1, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
}

export function daysRemaining(startDate: string): number {
  return Math.max(0, 180 - daysSinceStart(startDate));
}

// ─── Founder profile (Silver) ────────────────────────────────────────────────
// Replace xPostUrl values with real X post links as you post them.
// Add new entries at the top of the array so the most recent always shows first.
export const founderProfile: ProgressProfile = {
  id: "founder-silver",
  name: "Silver",
  handle: "@silverxhexhaj",
  xUrl: "https://x.com/silverxhexhaj",
  currentLevel: 1,
  startDate: "2026-03-10",
  entries: [
    {
      id: "w1-weekly",
      date: "2026-03-10",
      type: "weekly",
      title: "Week 1 — Scoreboard",
      summary:
        "First week of the challenge. Establishing the morning routine, cutting out phone-first mornings, and locking in a fixed wake time. The system is alive.",
      wins: [
        "Woke at 5:30 AM every day without exception",
        "Built the public site and launched it",
        "Completed daily time-block review each evening",
      ],
      misses: [
        "Spent 40 min on social media outside designated block on day 3",
        "Skipped one evening review session",
      ],
      lessons: [
        "Environment design matters more than willpower — phone now charges outside the bedroom",
        "Reviewing the day each night is the highest-leverage habit so far",
      ],
      proofItems: [
        { type: "metric", label: "Days completed", value: "7 / 7" },
        { type: "metric", label: "Wake time", value: "5:30 AM" },
        { type: "metric", label: "Phone-free mornings", value: "6 / 7" },
        { type: "note", label: "Focus", value: "Time Command — Level 1" },
      ],
      xPostUrl: "https://x.com/silverxhexhaj",
    },
    {
      id: "d7-daily",
      date: "2026-03-10",
      type: "daily",
      title: "Day 1 — Check-in",
      summary:
        "Launch day. The site is live, the challenge is public. No more planning — only execution starts now.",
      wins: [
        "Shipped the public site",
        "Committed the challenge in public with real accountability",
        "Morning block protected: no phone until 8 AM",
      ],
      misses: ["Dinner ran long — evening review done but abbreviated"],
      lessons: [
        "Shipping beats perfecting. The site is live and that creates accountability pressure that no private document can.",
      ],
      proofItems: [
        { type: "metric", label: "Day", value: "1 of 180" },
        { type: "metric", label: "Level", value: "1 — Command Time" },
        { type: "note", label: "Status", value: "Challenge officially started" },
      ],
      xPostUrl: "https://x.com/silverxhexhaj",
    },
  ],
};
