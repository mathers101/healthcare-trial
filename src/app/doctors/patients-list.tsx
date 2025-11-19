"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Types for our data
interface Patient {
  id: string;
  auth_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  medical_record_number?: string;
  assigned_doctor_id?: string;
  created_at: string;
  updated_at: string;
}

export default function DoctorPatientsList() {
  const { data: session } = useSession();

  const doctorId = session?.user?.id;

  //   if (session?.user?.role !== "doctor") {
  //     router.push("/");
  //   }

  const {
    data: patients,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["doctor-patients", doctorId],
    queryFn: async (): Promise<Patient[]> => {
      if (!doctorId) {
        throw new Error("Doctor ID is required");
      }
      console.log("hi", doctorId);

      const supabase = getSupabaseBrowserClient(session?.session);
      console.log(session?.session?.supabaseAccessToken);

      // Fetch patients assigned to this doctor
      const { data, error } = await supabase
        .from("patients")
        .select(`createdAt:created_at, record:patient_records (*)`);
      //   .eq("doctor_id", doctorId);
      console.log("data", data);

      if (error) {
        console.log(error);
        throw new Error(`Failed to fetch patients: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!doctorId, // Only run query if we have a doctor ID
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  if (!doctorId) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
        <p className="text-yellow-800 dark:text-yellow-400">Please log in to view your patients.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Patients</h2>
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm text-gray-600">Loading patients...</span>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
              <div className="animate-pulse">
                <div className="mb-2 h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-3 w-2/3 rounded bg-gray-300 dark:bg-gray-600"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <div className="flex items-start">
          <svg className="mr-3 mt-0.5 h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error loading patients</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm text-red-600 underline hover:text-red-500 dark:text-red-400"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Patients ({patients?.length || 0})</h2>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>

      {/* Patients List */}
      {!patients || patients.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No patients assigned</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You don&apos;t have any patients assigned to you yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    MRN: {patient.medical_record_number || "Not assigned"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Age: {calculateAge(patient.date_of_birth)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">DOB: {formatDate(patient.date_of_birth)}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">{patient.email}</span>
                </div>
                {patient.phone && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-400">{patient.phone}</span>
                  </div>
                )}
              </div>

              {patient.address && (
                <div className="mt-2 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">{patient.address}</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Patient since: {formatDate(patient.created_at)}
                </span>
                <button className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
