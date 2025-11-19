import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";
import { customSessionClient, emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL!, // Optional if the API base URL matches the frontend
  plugins: [emailOTPClient(), customSessionClient<typeof auth>()],
});

export const { signIn, signOut, useSession } = authClient;

export type SessionData = ReturnType<typeof useSession>["data"];
