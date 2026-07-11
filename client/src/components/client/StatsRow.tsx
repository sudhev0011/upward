import { CalendarDays, CheckCircle2, TrendingUp, Wallet } from "lucide-react";

interface StatsRowProps {
  stats?: {
    activeBookings: number;
    tasksCompleted: number;
    totalSpent: number;
  };
  walletBalance?: number;
}

export const StatsRow = ({ stats, walletBalance = 0 }: StatsRowProps) => {
  const data = [
    {
      label: "Active Bookings",
      value: stats?.activeBookings ?? 0,
      icon: CalendarDays,
      color: "text-[#5585A8]",
      bg: "bg-[#EAF2F9]",
      borderColor: "border-[#719FC4]/20",
    },
    {
      label: "Tasks Completed",
      value: stats?.tasksCompleted ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-200/50",
    },
    {
      label: "Total Spent",
      value: `₹${(stats?.totalSpent ?? 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-[#719FC4]",
      bg: "bg-slate-50",
      borderColor: "border-slate-200/50",
    },
    {
      label: "Wallet Balance",
      value: `₹${walletBalance.toLocaleString()}`,
      icon: Wallet,
      color: "text-amber-600",
      bg: "bg-amber-50",
      borderColor: "border-amber-200/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {data.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.borderColor} bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                {s.label}
              </p>
              <p className="text-2xl font-extrabold tracking-tight text-gray-900">
                {s.value}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
              <Icon className="h-6 w-6 stroke-[2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};