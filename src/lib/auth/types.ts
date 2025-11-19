import { Session } from "better-auth";

export type AuthSession = Session & { supabaseAccessToken?: string };
