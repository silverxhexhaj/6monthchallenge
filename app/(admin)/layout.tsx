import Link from "next/link";
import { signOutAction } from "@/app/(auth)/actions";
import { requireAdminViewer } from "@/lib/supabase/queries/viewer";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/cohorts", label: "Cohorts" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/founder-updates", label: "Founder Updates" },
  { href: "/admin/operations", label: "Operations" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await requireAdminViewer();

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-border px-8 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
          <span className="mr-4 text-[0.75rem] uppercase tracking-[3px] text-accent">
            Founder Admin
          </span>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.75rem] uppercase tracking-[3px] text-muted no-underline transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <span className="ml-auto text-[0.75rem] uppercase tracking-[3px] text-muted">
            {viewer.profile.display_name}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="border border-border px-4 py-2 text-[0.75rem] uppercase tracking-[3px] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Sign Out
            </button>
          </form>
        </div>
      </nav>
      {children}
    </div>
  );
}
