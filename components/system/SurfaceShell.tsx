import type { ReactNode } from "react";

interface SurfaceShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function SurfaceShell({
  eyebrow,
  title,
  description,
  children,
}: SurfaceShellProps) {
  return (
    <section className="min-h-screen px-8 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 inline-block border border-accent px-4 py-2 text-xs uppercase tracking-[4px] text-accent">
          {eyebrow}
        </div>
        <h1 className="max-w-3xl font-bebas text-[clamp(3rem,7vw,5rem)] leading-[0.95] tracking-[1px]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-[1.8] text-muted">{description}</p>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
