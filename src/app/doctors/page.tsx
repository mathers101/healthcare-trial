import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import DoctorPatientsList from "./patients-list";

export default async function DoctorsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    forbidden();
  }

  // Type assertion to access the role field
  const userWithRole = session.user as typeof session.user & { role?: string };

  if (userWithRole.role !== "doctor") {
    forbidden();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back, Dr. {session.user.name?.split(" ").slice(-1)[0]}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Patients List - Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <DoctorPatientsList />
            </div>
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-left text-white hover:bg-blue-700">
                  Schedule Appointment
                </button>
                <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-left text-white hover:bg-green-700">
                  Add Medical Note
                </button>
                <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-left text-white hover:bg-purple-700">
                  View Schedule
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Today&apos;s Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Appointments:</span>
                  <span className="font-medium text-gray-900 dark:text-white">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pending Reviews:</span>
                  <span className="font-medium text-gray-900 dark:text-white">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Messages:</span>
                  <span className="font-medium text-gray-900 dark:text-white">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
