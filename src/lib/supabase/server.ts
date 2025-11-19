import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/utils/database.types";
import { createClient } from "@supabase/supabase-js";
import { AuthSession } from "../auth";

export async function getSupabaseServerClient(session?: AuthSession | null) {
  if (!session) {
    return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: session?.supabaseAccessToken ? `Bearer ${session.supabaseAccessToken}` : "",
        },
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
