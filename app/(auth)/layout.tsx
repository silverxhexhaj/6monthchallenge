import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-border px-8 py-5">
        <Link
          href="/"
          className="text-[0.75rem] uppercase tracking-[3px] text-muted no-underline transition-colors hover:text-accent"
        >
          ← Back To The Challenge
        </Link>
      </nav>
      {children}
    </div>
  );
}
