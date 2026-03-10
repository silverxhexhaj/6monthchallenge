import type { ReactNode } from "react";

interface PlaceholderCardProps {
  title: string;
  body: string;
  children?: ReactNode;
}

export function PlaceholderCard({ title, body, children }: PlaceholderCardProps) {
  return (
    <div className="border border-border bg-card p-6">
      <h2 className="font-bebas text-3xl tracking-[1px] text-white">{title}</h2>
      <p className="mt-3 text-sm leading-[1.8] text-muted">{body}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
