"use server";

import { redirect } from "next/navigation";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function joinWaitlistAction(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "site").trim();
  const medium = String(formData.get("medium") ?? "organic").trim();
  const campaign = String(formData.get("campaign") ?? "mvp-ui").trim();

  if (!email) {
    redirect("/waitlist?error=Email is required.");
  }

  const supabase = await createSupabaseServiceRoleClient();
  const { error } = await supabase.from("waitlist_leads").upsert(
    {
      email,
      full_name: fullName || null,
      source,
      medium,
      campaign,
    },
    {
      onConflict: "email",
    },
  );

  if (error) {
    redirect(`/waitlist?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/waitlist?message=You are on the waitlist.");
}
