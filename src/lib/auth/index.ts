import { betterAuth, BetterAuthOptions, Session } from "better-auth";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { getSupabaseAdminClient } from "../supabase/admin";
import { customSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
// import * as fs from "fs";

const authOptions: BetterAuthOptions = {
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  advanced: {
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
        },
      },
    },
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  //   hooks: {
  //     after: createAuthMiddleware(async (ctx) => {
  //       if (ctx.context.newSession) {
  //         const auth_id = ctx.context.newSession.user.id;
  //         const supabase = getSupabaseAdminClient();

  //         await supabase.from("users").update({ deactivated_at: null }).eq("auth_id", auth_id);
  //       }
  //     }),
  //   },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // 10 minutes
    },
    modelName: "better_auth.session",
  },
  account: {
    modelName: "better_auth.account",
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "apple", "email-password"],
      allowDifferentEmails: false,
    },
  },
  user: {
    modelName: "better_auth.user",
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "patient",
      },
    },
  },
  verification: {
    modelName: "better_auth.verification",
  },
  plugins: [nextCookies()],
};

export const auth = betterAuth({
  ...authOptions,
  plugins: [
    ...(authOptions.plugins ?? []),
    customSession(async ({ user, session }) => {
      console.log(user);
      const supabase = getSupabaseAdminClient();

      // Type assertion to access the role field from additionalFields
      const userWithRole = user as typeof user & { role: string };

      let extraUser = null;

      // Fetch from the appropriate table based on user role
      if (userWithRole.role === "patient") {
        const { data } = await supabase.from("patients").select("*").eq("auth_id", user.id).single();
        extraUser = { ...data, patientId: data?.id };
      } else if (userWithRole.role === "doctor") {
        const { data } = await supabase.from("doctors").select("*").eq("auth_id", user.id).single();
        extraUser = { ...data, doctorId: data?.id };
      } else if (userWithRole.role === "nurse") {
        const { data } = await supabase.from("nurses").select("*").eq("auth_id", user.id).single();
        extraUser = { ...data, nurseId: data?.id };
      } else if (userWithRole.role === "admin") {
        const { data } = await supabase.from("admins").select("*").eq("auth_id", user.id).single();
        extraUser = { ...data, adminId: data?.id };
      }

      // Add a signed Supabase JWT if desired
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      let supabaseAccessToken: string | undefined;
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h expiry
          sub: user.id,
          email: user.email,
          role: "authenticated",
        };
        supabaseAccessToken = jwt.sign(payload, signingSecret);
      }

      return {
        user: {
          ...user,
          ...extraUser,
        },
        session: {
          ...session,
          supabaseAccessToken,
        },
      };
    }, authOptions),
  ],
});

export type AuthSession = Session & { supabaseAccessToken?: string };
