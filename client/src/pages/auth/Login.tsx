import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Activity } from "lucide-react";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { GoogleLoginButton } from "../../components/auth/GoogleLoginButton";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "sonner";
import type { CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutation } from "@/hooks/auth/useGoogle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLoginMutation();
  const { mutate: googleLogin } = useGoogleLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            dispatch(setCredentials(response.data));
            navigate('/')
            toast.success("Login successfull");
          }
        },

        onError(error) {
          toast.error(error.message);
        },
      },
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
      {/* Left side Form Area */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:flex-none lg:w-1/2 xl:w-5/12 mx-auto lg:mx-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto p-6 md:p-8 bg-white/70 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 rounded-3xl border border-white/50"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Upward
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100"
              >
                {error.message || "Failed to authenticate"}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                isPending ? "opacity-70 cursor-wait" : "hover:-translate-y-0.5"
              }`}
            >
              {isPending ? "Signing in..." : "Sign in"}
              {!isPending && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="relative my-8">
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
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side Decorative Area */}
      <div className="hidden lg:flex flex-1 relative bg-indigo-900 overflow-hidden isolate">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-900 to-slate-900 mix-blend-multiply" />

        {/* Animated Background Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 -left-24 w-[30rem] h-[30rem] bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-20"
        />

        <div className="relative z-10 flex flex-col justify-center px-16 h-full text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Connect. Collaborate. <br />
              Grow Upward.
            </h2>
            <p className="text-indigo-100 text-lg max-w-xl font-medium leading-relaxed">
              Join the platform where clients shape their vision and providers
              deliver excellence. Secure, fast, and built for modern workflows.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
