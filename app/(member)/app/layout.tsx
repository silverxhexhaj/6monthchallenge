import Link from "next/link";
import { signOutAction } from "@/app/(auth)/actions";
import { requireMemberAppViewer } from "@/lib/supabase/queries/viewer";

const memberLinks = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/today", label: "Today" },
  { href: "/app/proof", label: "Proof" },
  { href: "/app/reviews/weekly", label: "Weekly Review" },
  { href: "/app/reviews/monthly", label: "Monthly Review" },
  { href: "/app/progress", label: "Progress" },
  { href: "/app/settings", label: "Settings" },
];

export default async function MemberAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await requireMemberAppViewer();

  return (
    <div>
      <nav className="border-b border-border bg-dark px-8 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
          <span className="mr-4 text-[0.75rem] uppercase tracking-[3px] text-accent">
            {viewer.memberProgram.program?.title ?? "Member App"}
          </span>
          {memberLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.75rem] uppercase tracking-[3px] text-muted no-underline transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-auto">
            <form action={signOutAction}>
              <button
                type="submit"
                className="border border-border px-4 py-2 text-[0.75rem] uppercase tracking-[3px] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
