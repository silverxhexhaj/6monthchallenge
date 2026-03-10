import type { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function InfoCard({
  title,
  description,
  children,
  className = "",
}: InfoCardProps) {
  return (
    <div className={`border border-border bg-card p-6 ${className}`.trim()}>
      <h2 className="font-bebas text-3xl tracking-[1px] text-white">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-[1.8] text-muted">{description}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
