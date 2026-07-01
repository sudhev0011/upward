import { Link, NavLink, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  CreditCard,
  Star,
  Settings,
  LogOut,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useLogoutMutation } from "@/hooks/auth/useLogout";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";
import { logout } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/client/dashboard", icon: LayoutDashboard, label: "Overview" },
  {
    to: "/client/dashboard/bookings",
    icon: CalendarCheck,
    label: "My Bookings",
  },
  {
    to: "/client/dashboard/messages",
    icon: MessageSquare,
    label: "Messages",
  },
  { to: "/client/dashboard/payments", icon: CreditCard, label: "Payments" },
  { to: "/client/dashboard/reviews", icon: Star, label: "Reviews" },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const { mutate: logoutMutation } = useLogoutMutation();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        dispatch(logout());
        navigate("/login");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4]">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-gray-900">
          <Link to={"/"}>Upward</Link>
        </span>
      </div>

      {/* User chip */}
      <div className="mx-4 mt-4 mb-2 flex items-center gap-3 rounded-xl bg-[#EAF2F9] px-3 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#719FC4] text-xs font-bold text-white">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user?.name}
          </p>
          <p className="text-[11px] text-[#5585A8] font-medium">
            {user?.roles?.map((r)=>(
              <Badge key={r} className="bg-[#5585A8] text-white m-0.5">{r}</Badge>
            ))}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/client/dashboard"}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 mb-0.5 ${
                isActive
                  ? "bg-[#719FC4] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0 text-current opacity-70" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 px-3 py-3">
        <NavLink
          to="/client/dashboard/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-[#719FC4] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Settings className="h-4 w-4 shrink-0 text-current opacity-70" />
          Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
