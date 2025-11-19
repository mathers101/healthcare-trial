import { auth } from "@/lib/auth";
import { redirectDest } from "@/utils/redirect-dest";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    redirect(redirectDest(session.user.role));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 font-sans dark:from-gray-900 dark:to-gray-800">
      <main className="flex w-full max-w-md flex-col items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900">
          {/* Hospital Logo/Icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18M5 12h14" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fake Hospital</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to our healthcare portal</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/sign-in"
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="flex w-full items-center justify-center rounded-lg border-2 border-blue-600 px-6 py-3 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              Sign Up as Patient
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Need help? Contact our support team</p>
          </div>
        </div>
      </main>
    </div>
  );
}
