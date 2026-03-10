import { Link } from "react-router-dom";
import { Search, MessageSquare, CalendarCheck, Star, ArrowRight, type LucideIcon } from "lucide-react";

export const USER = {
  name: "Alex Johnson",
  initials: "AJ",
  email: "alex@example.com",
  memberSince: "Jan 2024",
  plan: "Pro",
  tasksCompleted: 24,
  totalSpent: 3840,
  savedPros: 7,
  activeBookings: 3,
};
interface QuickActionItem {
  icon: LucideIcon;
  label: string;
  sub: string;
  to: string;
  color: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  { icon: Search,        label: "Find a Pro",     sub: "Browse 2K+ experts",   to: "/dashboard/explore",  color: "bg-[#EAF2F9] text-[#719FC4]" },
  { icon: CalendarCheck, label: "My Bookings",    sub: "3 active now",          to: "/dashboard/bookings", color: "bg-emerald-50 text-emerald-500" },
  { icon: MessageSquare, label: "Messages",       sub: "2 unread",              to: "/dashboard/messages", color: "bg-indigo-50  text-indigo-500"  },
  { icon: Star,          label: "Leave a Review", sub: "2 pending reviews",     to: "/dashboard/reviews",  color: "bg-amber-50   text-amber-500"   },
];

export const WelcomeBanner = () => (
  <div className="relative overflow-hidden rounded-2xl bg-[#719FC4] px-6 py-6 text-white">
    {/* Blobs */}
    <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10" />
    <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/8"  />

    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.18em] mb-1">
          Welcome back
        </p>
        <h1 className="text-xl font-extrabold tracking-tight">
          Hey, {USER.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-white/70 text-sm mt-1">
          You have <span className="text-white font-bold">{USER.activeBookings} active bookings</span> and{" "}
          <span className="text-white font-bold">2 unread messages</span>.
        </p>
      </div>
      <Link
        to="/dashboard/explore"
        className="flex-shrink-0 flex items-center gap-2 self-start sm:self-auto rounded-xl bg-white text-[#719FC4] hover:bg-gray-50 px-5 py-2.5 text-sm font-bold transition-all duration-200 shadow-lg hover:-translate-y-px"
      >
        Post a Task <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

export const QuickActions = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {QUICK_ACTIONS.map(({ icon: Icon, label, sub, to, color }) => (
      <Link
        key={to}
        to={to}
        className="group flex flex-col gap-2.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-[#719FC4] transition-colors">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </div>
      </Link>
    ))}
  </div>
);