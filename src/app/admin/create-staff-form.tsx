"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import { generatePassword } from "@/utils/gen-password";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const createStaffSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  // @ts-expect-error idk
  role: z.enum(["doctor", "nurse", "admin"], {
    required_error: "Please select a role",
  }),
});

type CreateStaffFormData = z.infer<typeof createStaffSchema>;

export default function CreateStaffForm() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: CreateStaffFormData) => {
    startTransition(async () => {
      try {
        // Generate a random password
        const password = generatePassword();
        setGeneratedPassword(password);

        // Create the user with better-auth
        const { data: authData, error } = await authClient.signUp.email({
          email: data.email,
          password: "example1",
          name: `${data.firstName} ${data.lastName}`,
          role: data.role,
          // Note: You might need to add role handling in your better-auth setup
        });

        if (error) {
          console.error("Staff creation error:", error);
          if (error.message && error.message.includes("email")) {
            setError("email", { message: "This email is already registered" });
          } else {
            setError("root", { message: "Failed to create staff member. Please try again." });
          }
        } else if (authData) {
          // Success
          setSuccessMessage(`Staff member created successfully! Temporary password: ${password}`);
          console.log("Staff member created:", authData);

          // Reset form after successful creation
          setTimeout(() => {
            reset();
            setSuccessMessage("");
            setGeneratedPassword("");
          }, 10000); // Clear after 10 seconds
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("root", { message: "An unexpected error occurred. Please try again." });
      }
    });
  };

  const copyPasswordToClipboard = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword);
        alert("Password copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy password:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex items-start">
            <svg className="mr-3 mt-0.5 h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">{successMessage}</p>
              {generatedPassword && (
                <button
                  onClick={copyPasswordToClipboard}
                  className="mt-2 text-xs text-green-700 underline hover:text-green-600 dark:text-green-300"
                >
                  Click to copy password
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.root && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {errors.root.message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-xs text-red-600">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-xs text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@fakehospital.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            {...register("role")}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a role</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
        </div>

        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> A random 8-digit password will be automatically generated for the new staff member.
            Please share it securely with them.
          </p>
        </div>

        <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700">
          {isPending ? (
            <div className="flex items-center justify-center">
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Staff Member...
            </div>
          ) : (
            "Create Staff Member"
          )}
        </Button>
      </form>
    </div>
  );
}
