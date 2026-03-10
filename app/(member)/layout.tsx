import Link from "next/link";
import { signOutAction } from "@/app/(auth)/actions";
import { requireMemberRouteViewer } from "@/lib/supabase/queries/viewer";

export default async function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await requireMemberRouteViewer();

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-border px-8 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <div className="text-[0.7rem] uppercase tracking-[3px] text-accent">
              Member Access
            </div>
            <div className="mt-1 text-sm text-muted">
              Signed in as {viewer.profile.display_name}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[0.75rem] uppercase tracking-[3px] text-muted no-underline transition-colors hover:text-accent"
            >
              Marketing
            </Link>
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
