import { useReveal } from "@/lib/useReveal";

const STATS = [
  { value: "10K+", label: "Tasks Completed" },
  { value: "2K+",  label: "Verified Pros" },
  { value: "4.9★", label: "Avg Rating" },
  { value: "50+",  label: "Categories" },
];

export const StatsBar = () => {
  const ref = useReveal(0);

  return (
    <div className="border-y border-gray-100 bg-gray-50">
      <div
        ref={ref}
        className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200"
      >
        {STATS.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center gap-1 bg-gray-50 py-8 px-4 text-center"
          >
            <span className="text-3xl font-extrabold tracking-tight text-[#719FC4]">
              {item.value}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};