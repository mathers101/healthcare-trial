import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import CreateStaffForm from "./create-staff-form";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "admin") {
    forbidden();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage hospital staff and system settings</p>
        </div>

        {/* Admin Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Create New Staff Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Create New Staff Member</h2>
            <CreateStaffForm />
          </div>

          {/* Additional Admin Features Placeholder */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-left text-white hover:bg-blue-700">
                View All Staff
              </button>
              <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-left text-white hover:bg-green-700">
                Manage Permissions
              </button>
              <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-left text-white hover:bg-purple-700">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
