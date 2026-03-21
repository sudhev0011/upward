import React, { useState } from "react";
import {
  User,
  Lock,
  Trash2,
  Camera,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useGetProfileQuery } from "@/hooks/client/useGetProfile";
import { useUpdateProfileMutation } from "@/hooks/client/useUpdateProfile";
import {
  profileSchema,
  type ProfileFormData,
} from "@/utils/validations/client/profile.schema";

/* ─── Types ─────────────────────────────────────────── */
type Tab = "profile" | "notifications" | "security" | "billing" | "preferences";

/* ─── Sidebar tabs ───────────────────────────────────── */
const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
];

/* ─── Reusable field (Refactored for React Hook Form) ── */
const Field = React.forwardRef<HTMLInputElement, any>(
  ({ label, error, hint, type = "text", ...props }, ref) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 mb-1.5">
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        {...props}
        className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-200 focus:border-[#719FC4] focus:ring-[#719FC4]/20"
        } ${props.disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
      {hint && !error && (
        <p className="text-[11px] text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  ),
);
Field.displayName = "Field";

/* ─── Section wrapper ────────────────────────────────── */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 flex flex-col gap-5">
    <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
      {title}
    </h2>
    {children}
  </div>
);

/* ─── Helper for Initials ────────────────────────────── */
const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

/* ═══════════════════════════════════════════════════════ */
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Security State (Left as controlled state until you build a schema for it)
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  /* ── Server State (React Query) ── */
  const { data: response, isLoading } = useGetProfileQuery();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation();

  /* ── Client State (React Hook Form) ── */
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    // 'values' will automatically update the form when React Query finishes fetching!
    values: response?.data
      ? {
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          location: response.data.location || "",
        }
      : undefined,
  });

  const onSubmitProfile = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        // Optional: Invalidate query here to re-fetch, or let React Query handle it
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to update profile");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#719FC4]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage your account preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* ── Left nav ── */}
        <nav className="md:w-52 shrink-0">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-colors ${
                    activeTab === t.id
                      ? "bg-[#EAF2F9] text-[#5585A8] border-r-2 border-[#719FC4]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t.label}
                  {activeTab === t.id && (
                    <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── Right panels ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* ── Profile Tab ── */}
          {activeTab === "profile" && (
            <form
              onSubmit={handleSubmit(onSubmitProfile)}
              className="flex flex-col gap-5"
            >
              <Section title="Avatar">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    {response?.data?.profilePicture ? (
                      <img
                        src={response?.data?.profilePicture}
                        alt="Profile"
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#719FC4] text-2xl font-extrabold text-white">
                        {getInitials(response?.data?.name)}
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {response?.data?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      JPG or PNG. Max 5MB.
                    </p>
                    <button
                      type="button"
                      className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Upload Photo
                    </button>
                  </div>
                </div>
              </Section>

              <Section title="Personal Information">
                <Field
                  label="Full Name"
                  {...register("name")}
                  error={errors.name?.message}
                />

                {/* Email is typically disabled in settings unless there's a specific change-email flow */}
                <Field
                  label="Email Address"
                  type="email"
                  disabled
                  hint="Contact support to change your email."
                  {...register("email")}
                />

                <Field
                  label="Phone Number"
                  type="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                />

                <Field
                  label="Location"
                  {...register("location")}
                  error={errors.location?.message}
                />
              </Section>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isUpdating || !isDirty}
                  className="rounded-xl bg-[#719FC4] hover:bg-[#5585A8] disabled:bg-gray-300 disabled:cursor-not-allowed px-6 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                {isDirty && (
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {/* ── Security Tab ── */}
          {activeTab === "security" && (
            <div className="flex flex-col gap-5">
              <Section title="Change Password">
                {/* Notice how Field is still compatible with value/onChange if you manually pass them, 
                    though upgrading this to a nested form with Zod would be best! */}
                <Field
                  label="Current Password"
                  type="password"
                  value={passwords.current}
                  onChange={(e: any) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
                <Field
                  label="New Password"
                  type="password"
                  hint="Minimum 8 characters"
                  value={passwords.next}
                  onChange={(e: any) =>
                    setPasswords({ ...passwords, next: e.target.value })
                  }
                />
                <Field
                  label="Confirm Password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e: any) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
                <button className="self-start rounded-xl bg-[#719FC4] hover:bg-[#5585A8] px-5 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md">
                  Update Password
                </button>
              </Section>

              <Section title="Danger Zone">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Delete Account
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 shrink-0 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
