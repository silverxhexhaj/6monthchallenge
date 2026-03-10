import { getPublicEnv, getServerEnv } from "@/lib/env";

export function getSupabaseConfig() {
  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };
}

export function getSupabaseServiceRoleKey() {
  return getServerEnv().supabaseServiceRoleKey;
}
