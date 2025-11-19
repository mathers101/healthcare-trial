import { SupabaseClientType } from "./client";
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdminClient() {
  const supabase: SupabaseClientType = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  return supabase;
}
