import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/database.types";
import { AuthSession } from "@/lib/auth/types";

export type SupabaseClientType = SupabaseClient<Database>;
let client: SupabaseClient<Database> | undefined;

export function getSupabaseBrowserClient(session?: AuthSession | null) {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: session?.supabaseAccessToken ? `Bearer ${session?.supabaseAccessToken}` : "",
        },
      },
    }
  );
  return client;
}
