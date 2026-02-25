import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { useGoogleLoginMutation } from "@/hooks/auth/useGoogle";
import type { CredentialResponse } from "@react-oauth/google";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "provider">("client");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegisterMutation();
  const {mutate: googleLogin} = useGoogleLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ name, email, password, role },
      {
        onSuccess:(response)=>{
          toast.success(response.message);
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`)
        }, 

        onError: (error)=>{
          toast.error(error.message);
        }
      }
    );
  };

  const googleAuth = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.error("Google authentication failed. No token received.");
      return;
    }
    googleLogin(
      {
        idToken,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            dispatch(setCredentials(response.data));
            toast.success("Login successfull");
          }
        },
        onError: (error: any) => toast.error(error.response.data.message),
      },
    );
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-gray-50/50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left side Decorative Area */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden isolate">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-slate-900 to-purple-900 mix-blend-multiply" />

        {/* Animated Background Orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-0 w-[40rem] h-[40rem] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 -right-12 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
        />

        <div className="relative z-10 flex flex-col justify-center px-16 h-full text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Start building <br />
              your future today.
            </h2>
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-indigo-50">
                    Enterprise Security
                  </h3>
                  <p className="text-indigo-200/80 mt-1">
                    Your data is protected by industry-leading security
                    protocols.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-purple-50">
                    Real-time Analytics
                  </h3>
                  <p className="text-purple-200/80 mt-1">
                    Monitor your workflow and growth instantly as it happens.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side Form Area */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:flex-none lg:w-1/2 xl:w-5/12 mx-auto lg:mx-0 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto p-6 md:p-8 bg-white/70 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 rounded-3xl border border-white/50"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Join us and start your journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to join as a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`
                  cursor-pointer flex items-center justify-center px-4 py-3 border rounded-xl text-sm font-medium transition-all
                  ${
                    role === "client"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }
                `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === "client"}
                    onChange={() => setRole("client")}
                    className="sr-only"
                  />
                  Client
                </label>
                <label
                  className={`
                  cursor-pointer flex items-center justify-center px-4 py-3 border rounded-xl text-sm font-medium transition-all
                  ${
                    role === "provider"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }
                `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={role === "provider"}
                    onChange={() => setRole("provider")}
                    className="sr-only"
                  />
                  Provider
                </label>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100"
              >
                {error.message || "Registration failed"}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full flex justify-center items-center gap-2 py-3 mt-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                isPending ? "opacity-70 cursor-wait" : "hover:-translate-y-0.5"
              }`}
            >
              {isPending ? "Creating account..." : "Create account"}
              {!isPending && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <GoogleLoginButton handleGoogleSuccess={googleAuth} />
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
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
