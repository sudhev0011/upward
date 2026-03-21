import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CredentialResponse } from "@react-oauth/google";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Briefcase,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";

import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { useGoogleLoginMutation } from "@/hooks/auth/useGoogle";
import { setCredentials } from "@/store/slices/authSlice";
import {
  registerSchema,
  type RegisterFormData,
} from "@/utils/validations/auth/register.schema";

const panelFeatures = [
  {
    icon: ShieldCheck,
    title: "Vetted & Verified",
    desc: "Every professional is background-checked before joining.",
  },
  {
    icon: Zap,
    title: "Matched in Minutes",
    desc: "Our algorithm connects you with the right person fast.",
  },
  {
    icon: Star,
    title: "Satisfaction Guaranteed",
    desc: "Pay only when you're 100% happy with the work.",
  },
];

const Register = () => {
  const [showPw, setShowPw] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    mutate: registerMutation,
    isPending,
    error: apiError,
  } = useRegisterMutation();
  const { mutate: googleLogin } = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roles: ["client"],
    },
    mode: "onTouched",
  });

  const selectedRoles = watch("roles");

  const onSubmit = (data: RegisterFormData) => {
    registerMutation(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const handleGoogleAuth = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.error("Google authentication failed.");
      return;
    }
    googleLogin(
      { idToken },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            dispatch(setCredentials(response.data));
            toast.success("Login successful");
          }
        },
        onError: (error: any) =>
          toast.error(error.response?.data?.message || "Login failed"),
      },
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Left: Decorative panel ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between overflow-hidden bg-gray-900 p-16 relative">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(113,159,196,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(113,159,196,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#719FC4]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#719FC4]/10 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4]">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            Upward
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
            Start building
            <br />
            your future today.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-10">
            Whether you're a client looking for help or a professional ready to
            grow — Upward is your platform.
          </p>
          <div className="space-y-5">
            {panelFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#719FC4]/15 text-[#719FC4]">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 p-5"
        >
          <div className="flex -space-x-2">
            {["SK", "JR", "PM", "DC"].map((init, i) => (
              <div
                key={init}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-900 bg-[#719FC4] text-[10px] font-bold text-white"
                style={{ zIndex: 4 - i }}
              >
                {init}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-bold text-white">Join 10,000+ users</p>
            <p className="text-xs text-gray-500">
              already getting work done on Upward
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:flex-none xl:w-5/12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-full max-w-sm"
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 group lg:hidden"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4] transition-colors duration-200 group-hover:bg-[#5585A8]">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              Upward
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Join us and start your journey today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-[#719FC4]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`block w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-[#719FC4] focus:ring-[#719FC4]/20"}`}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-[#719FC4]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`block w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-[#719FC4] focus:ring-[#719FC4]/20"}`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-[#719FC4]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`block w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-[#719FC4] focus:ring-[#719FC4]/20"}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role selector */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                I want to join as
              </label>

              <div className="grid grid-cols-2 gap-3">
                {(["client", "provider"] as const).map((r) => {
                  const isSelected = selectedRoles?.includes(r);

                  return (
                    <label
                      key={r}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        isSelected
                          ? "border-[#719FC4] bg-[#EAF2F9] text-[#5585A8] shadow-sm"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={r}
                        className="sr-only"
                        {...register("roles")}
                      />

                      {r === "client" ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Briefcase className="h-3.5 w-3.5" />
                      )}

                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* API Error Box */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600"
              >
                {apiError.message || "Registration failed"}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className={`mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#719FC4] py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#5585A8] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#719FC4]/40 ${
                isPending ? "cursor-wait opacity-70" : "hover:-translate-y-px"
              }`}
            >
              {isPending ? "Creating account…" : "Create account"}
              {!isPending && <ArrowRight className="h-4 w-4" />}
            </button>

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-50 px-3 text-gray-400 font-medium">
                  or continue with
                </span>
              </div>
            </div>

            <GoogleLoginButton handleGoogleSuccess={handleGoogleAuth} />
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#719FC4] hover:text-[#5585A8] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
