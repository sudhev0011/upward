import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/constants/user-role";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/hooks/useRedux";
import { setActiveRole } from "@/store/slices/authSlice";
import { ArrowUpRight } from "lucide-react";

const roleRoutes: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  provider: "/provider/dashboard",
  client: "/client/dashboard",
};

const ROLE_META: Record<
  UserRole,
  {
    label: string;
    description: string;
    icon: string;
    accent: string;
    lightBg: string;
  }
> = {
  client: {
    label: "Client",
    description: "Book services, track your jobs, manage payments",
    icon: "✦",
    accent: "#719FC4",
    lightBg: "#EAF2F9",
  },
  provider: {
    label: "Provider",
    description: "Manage your bookings, grow your business",
    icon: "◈",
    accent: "#5585A8",
    lightBg: "#ddeef7",
  },
  admin: {
    label: "Admin",
    description: "Platform management, analytics, oversight",
    icon: "⬡",
    accent: "#3d6a8a",
    lightBg: "#cce0ef",
  },
};

const SelectRole = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  if (!user?.roles) return null;

  const handleSelect = (role: UserRole) => {
    dispatch(setActiveRole(role));
    navigate(roleRoutes[role]);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f0f7fc 0%, #e4f1f8 50%, #f8fbfe 100%)",
      }}
    >
      {/* Decorative background blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #719FC4 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #5585A8 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/4 h-48 w-48 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #719FC4 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          border: "1px solid rgba(113,159,196,0.15)",
          boxShadow:
            "0 8px 48px rgba(85,133,168,0.12), 0 2px 8px rgba(85,133,168,0.06)",
          padding: "40px 36px 36px",
        }}
      >
        {/* Logo mark */}
        <div className="flex items-center justify-center mb-8 gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4] transition-all duration-200 group-hover:bg-[#5585A8]">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Upward
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-extrabold tracking-tight mb-2"
            style={{ color: "#1a2e3d" }}
          >
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm" style={{ color: "#7a96a8" }}>
            How would you like to continue today?
          </p>
        </div>

        {/* Role buttons */}
        <div className="flex flex-col gap-3">
          {(user.roles as UserRole[]).map((role) => {
            const meta = ROLE_META[role] ?? {
              label: role,
              description: `Continue as ${role}`,
              icon: "◆",
              accent: "#719FC4",
              lightBg: "#EAF2F9",
            };

            return (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                className="group w-full text-left transition-all duration-200"
                style={{
                  background: "white",
                  border: `1.5px solid rgba(113,159,196,0.18)`,
                  borderRadius: "18px",
                  padding: "16px 20px",
                  boxShadow: "0 1px 4px rgba(85,133,168,0.06)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = meta.lightBg;
                  el.style.border = `1.5px solid ${meta.accent}`;
                  el.style.boxShadow = `0 4px 20px rgba(85,133,168,0.14)`;
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "white";
                  el.style.border = `1.5px solid rgba(113,159,196,0.18)`;
                  el.style.boxShadow = `0 1px 4px rgba(85,133,168,0.06)`;
                  el.style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon bubble */}
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold transition-all duration-200"
                    style={{ background: meta.lightBg, color: meta.accent }}
                  >
                    {meta.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold capitalize mb-0.5"
                      style={{ color: "#1a2e3d" }}
                    >
                      {meta.label}
                    </p>
                    <p
                      className="text-xs leading-snug"
                      style={{ color: "#7a96a8" }}
                    >
                      {meta.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div
                    className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: meta.accent }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8H13M9 4L13 8L9 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: "#a8bcc8" }}>
          You can switch roles anytime from the sidebar
        </p>
      </div>
    </div>
  );
};

export default SelectRole;
