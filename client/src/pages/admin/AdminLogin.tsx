import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  LayoutDashboard,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/useRedux";
import { toast } from "sonner";
import { useAdminLoginMutation } from "@/hooks/auth/useAdminLogin";
import { setActiveRole, setCredentials } from "@/store/slices/authSlice";
import { UserRole } from "@/constants/user-role";
import {
  loginSchema,
  type LoginFormData,
} from "@/utils/validations/auth/login.schema";

const AdminLogin = () => {
  const [showPw, setShowPw] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    mutate: loginMutation,
    isPending,
    error: apiError,
  } = useAdminLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          const isAdmin = response.data.roles.includes(UserRole.ADMIN);
          
          if (!isAdmin) {
            toast.error("Access Denied: Admin privileges required.");
            return;
          }

          dispatch(setCredentials(response.data));
          dispatch(setActiveRole(UserRole.ADMIN));
          
          toast.success("Identity Verified. Accessing Terminal...");
          navigate("/admin");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Accents using #719FC4 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#719FC4]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#719FC4]/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[440px]"
      >
        <div className="bg-[#1E293B]/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] p-10 shadow-2xl">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="h-16 w-16 bg-[#719FC4]/10 rounded-2xl flex items-center justify-center border border-[#719FC4]/30 mb-5 shadow-[0_0_30px_rgba(113,159,196,0.15)]">
              <ShieldCheck className="h-9 w-9 text-[#719FC4]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Control Center
            </h1>
            <div className="mt-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#719FC4] animate-pulse" />
                <p className="text-slate-400 text-[13px] font-medium tracking-wide">
                    ADMINISTRATOR SECURE ACCESS
                </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Input Group: Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#719FC4] uppercase tracking-[0.2em] ml-1">
                System Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-[#719FC4] transition-colors" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="admin@upward.io"
                  className={`w-full bg-slate-900/60 border ${
                    errors.email ? "border-red-500/50" : "border-slate-700"
                  } rounded-xl py-3.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#719FC4]/30 focus:border-[#719FC4] transition-all placeholder:text-slate-600`}
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-red-400 ml-1 font-medium italic">{errors.email.message}</span>
              )}
            </div>

            {/* Input Group: Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#719FC4] uppercase tracking-[0.2em] ml-1">
                Master Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-[#719FC4] transition-colors" />
                </div>
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••••••"
                  className={`w-full bg-slate-900/60 border ${
                    errors.password ? "border-red-500/50" : "border-slate-700"
                  } rounded-xl py-3.5 pl-11 pr-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#719FC4]/30 focus:border-[#719FC4] transition-all placeholder:text-slate-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-[#719FC4] transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-red-400 ml-1 font-medium italic">{errors.password.message}</span>
              )}
            </div>

            {/* API Error UI */}
            {apiError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl"
              >
                <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-xs text-red-400 font-semibold leading-tight">{apiError.message}</p>
              </motion.div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={isPending}
              className="group w-full bg-[#719FC4] hover:bg-[#5a8bb3] disabled:bg-[#719FC4]/40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#719FC4]/20 flex items-center justify-center gap-3 relative overflow-hidden"
            >
              {isPending ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LayoutDashboard className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="tracking-wide">Authorize & Enter</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-10 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              Encrypted Session • IP Logged
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;