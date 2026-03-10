import Link from "next/link";
import { InfoCard } from "@/components/system/InfoCard";
import { MessageBanner } from "@/components/system/MessageBanner";
import { SurfaceShell } from "@/components/system/SurfaceShell";

interface VerifyPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;

  return (
    <SurfaceShell
      eyebrow="Auth Surface"
      title="Check Your Email."
      description="Verification, invite acceptance, and password recovery all land back inside this app through your email link."
    >
      <InfoCard
        title="Next Step"
        description="Open the email from Supabase, follow the link, and you&apos;ll be returned here with an active session."
      >
        <div className="space-y-4">
          {params.message ? <MessageBanner message={params.message} /> : null}
          {params.error ? <MessageBanner message={params.error} tone="error" /> : null}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-black no-underline"
            >
              Back To Login
            </Link>
            <Link
              href="/signup"
              className="border border-border px-6 py-3 text-xs uppercase tracking-[3px] text-muted no-underline"
            >
              Create Another Account
            </Link>
          </div>
        </div>
      </InfoCard>
    </SurfaceShell>
  );
}
