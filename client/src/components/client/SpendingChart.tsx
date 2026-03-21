export const SPENDING_MONTHS = [
  { month: "Oct", amount: 210 },
  { month: "Nov", amount: 580 },
  { month: "Dec", amount: 340 },
  { month: "Jan", amount: 920 },
  { month: "Feb", amount: 635 },
  { month: "Mar", amount: 840 },
];

export const CATEGORY_SPLIT = [
  { label: "Onsite", pct: 52, color: "#719FC4" },
  { label: "Offsite", pct: 35, color: "#A8C8E0" },
  { label: "Dedicated", pct: 13, color: "#D4E8F4" },
];
const MAX_AMOUNT = Math.max(...SPENDING_MONTHS.map((m) => m.amount));

export const SpendingChart = () => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-base font-bold text-gray-900">Spending Overview</h2>
        <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-extrabold tracking-tight text-gray-900">
          $3,525
        </p>
        <p className="text-xs text-emerald-500 font-semibold">
          +12% vs prev period
        </p>
      </div>
    </div>

    {/* Bar chart */}
    <div className="flex items-end gap-2 h-36 mb-3">
      {SPENDING_MONTHS.map((m) => {
        const pct = (m.amount / MAX_AMOUNT) * 100;
        const isCurrent = m.month === "Mar";
        return (
          <div
            key={m.month}
            className="flex flex-1 flex-col items-center gap-1 group"
          >
            <div
              className="relative w-full flex items-end"
              style={{ height: "120px" }}
            >
              <div
                className={`w-full rounded-t-lg transition-all duration-500 group-hover:opacity-90 ${isCurrent ? "bg-[#719FC4]" : "bg-[#719FC4]/25 group-hover:bg-[#719FC4]/40"}`}
                style={{ height: `${pct}%` }}
              >
                {/* Tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-semibold rounded-md px-2 py-0.5 whitespace-nowrap pointer-events-none">
                  ${m.amount}
                </div>
              </div>
            </div>
            <span
              className={`text-[11px] font-medium ${isCurrent ? "text-[#719FC4] font-bold" : "text-gray-400"}`}
            >
              {m.month}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export const CategorySplit = () => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
    <h2 className="text-base font-bold text-gray-900 mb-1">By Category</h2>
    <p className="text-xs text-gray-400 mb-5">Spending distribution</p>

    {/* Stacked bar */}
    <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
      {CATEGORY_SPLIT.map((c) => (
        <div
          key={c.label}
          className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
          style={{ width: `${c.pct}%`, backgroundColor: c.color }}
        />
      ))}
    </div>

    {/* Legend */}
    <div className="space-y-3">
      {CATEGORY_SPLIT.map((c) => (
        <div key={c.label} className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: c.color }}
            />
            <span className="text-sm text-gray-600">{c.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${c.pct}%`, backgroundColor: c.color }}
              />
            </div>
            <span className="text-sm font-bold text-gray-900 w-8 text-right">
              {c.pct}%
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Total */}
    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
      <span className="text-xs text-gray-400">Total this period</span>
      <span className="text-sm font-bold text-gray-900">$3,840</span>
    </div>
  </div>
);
