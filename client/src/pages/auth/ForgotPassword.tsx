import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/utils/validations/auth/email.schema";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    mutateAsync: forgotPassword,
    isPending,
    error: apiError,
  } = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    getValues, // <-- We use this to display the email on the success screen
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  // 2. Form Submit Handler
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      toast.success("Reset link sent!");
      setIsSubmitted(true);
    } catch {
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  /* ── Success state ── */
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm text-center"
        >
          {/* Icon */}
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-2">
            Check your email
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            We've sent a password reset link to
          </p>
          <p className="text-sm font-bold text-gray-800 mb-8">
            {getValues("email")}
          </p>

          <div className="rounded-xl border border-gray-100 bg-white p-4 text-xs text-gray-400 leading-relaxed mb-8 shadow-sm">
            Click the link in the email to reset your password. The link will
            expire in{" "}
            <span className="font-semibold text-gray-600">1 hour</span>.
          </div>

          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#719FC4] py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#5585A8] hover:shadow-md hover:-translate-y-px"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>

          <p className="mt-5 text-xs text-gray-400">
            Didn't receive it?{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="font-semibold text-[#719FC4] hover:text-[#5585A8] transition-colors"
            >
              Try again
            </button>
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Left: Form ── */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:flex-none xl:w-5/12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-full max-w-sm"
        >
          {/* Brand */}
          <Link to="/" className="mb-10 inline-flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4] transition-colors duration-200 group-hover:bg-[#5585A8]">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              Upward
            </span>
          </Link>

          {/* Icon + heading */}
          <div className="mb-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2F9]">
              <Mail className="h-5 w-5 text-[#719FC4]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              No worries — enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* API Error Box */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600"
            >
              {apiError.message || "Something went wrong. Please try again."}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-[#719FC4]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`block w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-[#719FC4] focus:ring-[#719FC4]/20"
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#719FC4] py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#5585A8] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#719FC4]/40 ${
                isPending ? "cursor-wait opacity-70" : "hover:-translate-y-px"
              }`}
            >
              {isPending ? "Sending…" : "Send Reset Link"}
              {!isPending && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-7 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#719FC4] hover:text-[#5585A8] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Right: Decorative panel ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center overflow-hidden bg-[#719FC4] p-16 relative">
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#5585A8]/40 blur-3xl" />

        {/* Top brand */}
        <div className="relative mb-auto flex items-center gap-2 pb-16">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            Upward
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
            It happens
            <br />
            to everyone.
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm mb-10">
            We'll have you back in your account in no time. Just enter your
            email and follow the link we send you.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: "01", text: "Enter your account email address" },
              { step: "02", text: "Click the link in the email we send" },
              { step: "03", text: "Create a new password and sign in" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-xs font-black text-white">
                  {item.step}
                </div>
                <p className="text-sm text-white/75">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative mt-auto pt-16" />
      </div>
    </div>
  );
};

export default ForgotPassword;
