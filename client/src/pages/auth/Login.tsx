import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/useRedux";
import { toast } from "sonner";
import type { CredentialResponse } from "@react-oauth/google";
import { UserRole } from "@/constants/user-role";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { useGoogleLoginMutation } from "@/hooks/auth/useGoogle";
import { GoogleLoginButton } from "../../components/auth/GoogleLoginButton";
import { setActiveRole, setCredentials } from "@/store/slices/authSlice";
import {
  loginSchema,
  type LoginFormData,
} from "@/utils/validations/auth/login.schema";
const features = [
  { value: "10K+", label: "Tasks completed" },
  { value: "2K+", label: "Verified pros" },
  { value: "4.9★", label: "Avg rating" },
];

const navigateByRole = (role: UserRole, navigate: (path: string) => void) => {
  const routes: Record<UserRole, string> = {
    [UserRole.PROVIDER]: "/provider/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.CLIENT]: "/client/dashboard",
  };
  navigate(routes[role] || "/");
};

const Login = () => {
  const [showPw, setShowPw] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    mutate: loginMutation,
    isPending,
    error: apiError,
  } = useLoginMutation();
  const { mutate: googleLogin } = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          dispatch(setCredentials(response.data));
          toast.success("Login successful");
          if(response?.data?.roles?.length === 1){
            dispatch(setActiveRole(response?.data?.roles[0]))
            navigateByRole(response?.data?.roles[0], navigate)
          }else if(response?.data?.roles?.length > 1){
            navigate('/select-role')
          }
        }
      },
      onError: (error) => {
        // console.log(error.name)
        toast.error(error.message);
      },
    });
  };

  const googleAuth = (credentialResponse: CredentialResponse) => {
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

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your account to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#719FC4] transition-colors hover:text-[#5585A8]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-[#719FC4]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`block w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-[#719FC4] focus:ring-[#719FC4]/20"
                  }`}
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

            {/* API Error Box */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600"
              >
                {apiError.message || "Failed to authenticate"}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#719FC4] py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#5585A8] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#719FC4]/40 ${
                isPending ? "cursor-wait opacity-70" : "hover:-translate-y-px"
              }`}
            >
              {isPending ? "Signing in…" : "Sign in"}
              {!isPending && <ArrowRight className="h-4 w-4" />}
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-50 px-3 text-gray-400 font-medium">
                  or continue with
                </span>
              </div>
            </div>

            <GoogleLoginButton handleGoogleSuccess={googleAuth} />
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#719FC4] hover:text-[#5585A8] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right: Decorative panel ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between overflow-hidden bg-[#719FC4] p-16 relative">
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Radial glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#5585A8]/40 blur-3xl" />

        {/* Top brand mark */}
        <div className="relative flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            Upward
          </span>
        </div>

        {/* Centre copy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
            Connect.
            <br />
            Collaborate.
            <br />
            Grow Upward.
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Join the platform where clients find top professionals and get
            things done — fast, reliably, and on their terms.
          </p>

          {/* Stats row */}
          <div className="mt-10 flex gap-8">
            {features.map((f) => (
              <div key={f.label}>
                <p className="text-2xl font-extrabold text-white tracking-tight">
                  {f.value}
                </p>
                <p className="text-xs font-semibold text-white/60 mt-0.5 uppercase tracking-widest">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative rounded-2xl bg-white/10 border border-white/20 p-6 backdrop-blur-sm"
        >
          <p className="text-sm text-white/80 leading-relaxed italic mb-4">
            "Upward sent a plumber within hours. The process was completely
            seamless from start to finish."
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
              SK
            </div>
            <div>
              <p className="text-sm font-bold text-white">Sarah K.</p>
              <p className="text-xs text-white/50">Homeowner, New York</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
