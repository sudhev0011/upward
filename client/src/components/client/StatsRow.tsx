export const StatsRow = ({
  stats,
}: {
  stats?: {
    activeBookings: number;
    tasksCompleted: number;
    totalSpent: number;
    savedPros: number;
  };
}) => {
  const data = [
    { label: "Active Bookings", value: stats?.activeBookings ?? 0 },
    { label: "Tasks Completed", value: stats?.tasksCompleted ?? 0 },
    { label: "Total Spent",     value: `₹${(stats?.totalSpent ?? 0).toLocaleString()}` },
    { label: "Saved Pros",      value: stats?.savedPros ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((s, i) => (
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
        </div>
      ))}
    </div>
  );
};