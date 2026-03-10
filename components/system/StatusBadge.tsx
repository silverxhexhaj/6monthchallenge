import type { ReactNode } from "react";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}

const toneClasses = {
  neutral: "border-border text-muted",
  success: "border-phase4 text-phase4",
  warning: "border-phase2 text-phase2",
  danger: "border-red-500 text-red-300",
};

export function StatusBadge({
  children,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center border px-3 py-1 text-[0.7rem] uppercase tracking-[2px] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
