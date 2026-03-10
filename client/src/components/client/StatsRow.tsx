import { TrendingUp, TrendingDown } from "lucide-react";
export const STATS = [
  { label: "Active Bookings",    value: "3",      delta: "+1 this week",   up: true  },
  { label: "Tasks Completed",    value: "24",     delta: "+3 this month",  up: true  },
  { label: "Total Spent",        value: "$3,840", delta: "-8% vs last mo", up: false },
  { label: "Saved Pros",         value: "7",      delta: "+2 recently",    up: true  },
];
export const StatsRow = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {STATS.map((s, i) => (
      <div
        key={s.label}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        style={{ animationDelay: `${i * 60}ms` }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
          {s.label}
        </p>
        <p className="text-2xl font-extrabold tracking-tight text-gray-900 mb-1.5">
          {s.value}
        </p>
        <div className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-emerald-500" : "text-rose-400"}`}>
          {s.up
            ? <TrendingUp  className="h-3 w-3" />
            : <TrendingDown className="h-3 w-3" />
          }
          {s.delta}
        </div>
      </div>
    ))}
  </div>
);