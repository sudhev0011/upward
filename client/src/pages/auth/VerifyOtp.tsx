import { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowRight,
  Mail,
} from "lucide-react";
import { UserRole } from "@/constants/user-role";
import { toast } from "sonner";
import { useVerifyOtpMutation } from "@/hooks/auth/useVerifyOtp";
import { setActiveRole, setCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/hooks/useRedux";
import { useRequestOtpMutation } from "@/hooks/auth/useRequestOtp";

/* ─── OTP input hook (unchanged logic) ─── */
const useOtpInput = (length: number = 6) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    if (value && index < length - 1) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }
  };

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    if (value === "" && values[index] !== "") {
      setTimeout(() => inputRefs.current[index]?.focus(), 0);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted.length) return;
    const newValues = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) newValues[i] = pasted[i];
    setValues(newValues);
    const next = newValues.findIndex((v, i) => i >= 0 && v === "");
    setTimeout(
      () => inputRefs.current[next !== -1 ? next : length - 1]?.focus(),
      0,
    );
  };

  const reset = () => setValues(Array(length).fill(""));
  const getOtp = () => values.join("");
  const isComplete = () =>
    values.every((v) => v !== "") && values.length === length;

  return {
    values,
    inputRefs,
    handleChange,
    handleInput,
    handleKeyDown,
    handlePaste,
    reset,
    getOtp,
    isComplete,
  };
};

/* ─── Countdown hook (unchanged logic) ─── */
const useCountdown = () => {
  const [countdown, setCountdown] = useState(0);
  const start = (s: number) => setCountdown(s);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return { countdown, start, formatTime };
};

/* ─── Helpers (unchanged) ─── */
const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object" && "res" in error) {
    const r = (error as any).res;
    if (r?.status === 429)
      return "Please wait 30 seconds before requesting another OTP";
    if (r?.data?.message) return r.data.message;
  }
  return fallback;
};

const navigateByRole = (role: UserRole, navigate: (path: string) => void) => {
  const routes: Record<UserRole, string> = {
    [UserRole.PROVIDER]: "/provider/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.CLIENT]: "/client/dashboard",
  };
  navigate(routes[role] || "/");
};

/* ─── Component ─── */
const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const email = searchParams.get("email") || "";

  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const otp = useOtpInput(6);
  const countdown = useCountdown();

  const { mutateAsync: verifyOtp, isPending: isVerifying } =
    useVerifyOtpMutation();
  const { mutateAsync: requestOtp, isPending: isResending } =
    useRequestOtpMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.isComplete()) return;
    setError(null);

    try {
      const res = await verifyOtp({ email, code: otp.getOtp() });
      if (res.success && res.data) {
        dispatch(setCredentials(res.data));
        setVerificationSuccess(true);
        toast.success("Email verified successfully!", { duration: 3000 });
        if (res?.data?.roles?.length === 1) {
          dispatch(setActiveRole(res?.data?.roles[0]));
          navigateByRole(res?.data?.roles[0], navigate);
        } else if (res?.data?.roles?.length > 1) {
          navigate("/select-role");
        }
      } else {
        const msg = res.message || "Invalid or expired OTP code";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = extractErrorMessage(err, "Verification failed");
      setError(msg);
      otp.reset();
    }
  };

  const handleResend = async () => {
    if (countdown.countdown > 0) return;
    setError(null);

    try {
      const res = await requestOtp(email);
      if (res.success) {
        setOtpSent(true);
        toast.success("New code sent!");
        countdown.start(60);
        otp.reset();
      } else {
        setError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to send OTP");
      setError(msg);
      if ((err as any)?.res?.status === 429) countdown.start(30);
    }
  };

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
              <ShieldCheck className="h-5 w-5 text-[#719FC4]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-gray-800">{email}</span>
            </p>
          </div>

          {/* Status messages */}
          {otpSent && !error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-xs font-medium text-green-700"
            >
              <CheckCircle className="h-4 w-4 shrink-0" />A new code has been
              sent to your email.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600"
            >
              {error}
            </motion.div>
          )}

          {verificationSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-xs font-medium text-green-700"
            >
              <CheckCircle className="h-4 w-4 shrink-0" />
              Email verified! Redirecting…
            </motion.div>
          )}

          {/* OTP form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Verification code
              </label>

              {/* OTP boxes */}
              <div className="flex gap-2.5">
                {otp.values.map((value, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otp.inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={value}
                    onChange={(e) => otp.handleChange(index, e.target.value)}
                    onInput={(e) => otp.handleInput(index, e)}
                    onKeyDown={(e) => otp.handleKeyDown(index, e)}
                    onPaste={otp.handlePaste}
                    disabled={isVerifying || isResending}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    className={`h-12 w-full max-w-[48px] rounded-xl border text-center text-lg font-bold text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20 disabled:opacity-50 ${
                      value
                        ? "border-[#719FC4] bg-[#EAF2F9] text-[#5585A8]"
                        : "border-gray-200 bg-white focus:border-[#719FC4]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !otp.isComplete()}
              className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#719FC4] py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#5585A8] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#719FC4]/40 ${
                isVerifying || !otp.isComplete()
                  ? "cursor-not-allowed opacity-60"
                  : "hover:-translate-y-px"
              }`}
            >
              {isVerifying ? "Verifying…" : "Verify Email"}
              {!isVerifying && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="mb-2 text-sm text-gray-500">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={countdown.countdown > 0 || isVerifying || isResending}
              className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${
                countdown.countdown > 0 || isVerifying || isResending
                  ? "cursor-not-allowed text-gray-300"
                  : "text-[#719FC4] hover:text-[#5585A8]"
              }`}
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Sending…
                </>
              ) : countdown.countdown > 0 ? (
                <>
                  <Clock className="h-3.5 w-3.5" /> Resend in{" "}
                  {countdown.formatTime(countdown.countdown)}
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" /> Resend Code
                </>
              )}
            </button>
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
            One last step
            <br />
            to get in.
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm mb-10">
            We just need to confirm that email address is yours. Enter the code
            we sent and you're all set.
          </p>

          {/* Info cards */}
          <div className="space-y-3">
            {[
              {
                icon: Mail,
                title: "Check your inbox",
                desc: `Code sent to ${email || "your email"}`,
              },
              {
                icon: Clock,
                title: "Code expires in 10 min",
                desc: "Request a new one if it expires",
              },
              {
                icon: ShieldCheck,
                title: "Secure verification",
                desc: "Your account is protected",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-white/55 mt-0.5 truncate max-w-[220px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative mt-auto pt-16" />
      </div>
    </div>
  );
};

export default VerifyOtp;
