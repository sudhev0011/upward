import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useGetProviderAvailability } from "@/hooks/public/providers/availability/useGetProviderAvailability";
import { useGetProviderAvailabilityOverrides } from "@/hooks/public/providers/availability/useGetProviderAvailabilityOverrides";
import { useGetProviderUnavailability } from "@/hooks/public/providers/availability/useGetProviderUnavailability";
import {
  resolveDayStatus,
  getMonthDays,
  DayStatus,
} from "@/utils/availability/availability.utils";

interface Props {
  providerId: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayStyle(status: DayStatus, isToday: boolean, isPast: boolean) {
  const base =
    "relative flex flex-col items-center justify-center rounded-xl h-14 text-sm transition-all ";
  if (isPast) return base + "text-gray-300 bg-transparent cursor-default";
  if (isToday) {
    if (status.type === "available")
      return (
        base +
        "bg-[#719FC4] text-white font-bold ring-2 ring-[#719FC4] ring-offset-1 cursor-default"
      );
    if (status.type === "unavailable")
      return (
        base +
        "bg-red-100 text-red-400 font-bold ring-2 ring-red-200 ring-offset-1 cursor-default"
      );
    return base + "bg-gray-100 text-gray-400 font-bold cursor-default";
  }
  if (status.type === "available")
    return base + "bg-[#EEF5FB] text-[#4A86B0] font-medium cursor-default";
  if (status.type === "unavailable") {
    console.log('found the culprit')
    return base + "bg-red-50 text-red-400 cursor-default";
  }
  return base + "bg-gray-50 text-gray-300 cursor-default";
}

export const AvailabilitySection = ({ providerId }: Props) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const { data: availData, isLoading: loadingAvail } =
    useGetProviderAvailability(providerId);
  const { data: overridesData, isLoading: loadingOverrides } =
    useGetProviderAvailabilityOverrides(providerId);
  const { data: unavailData, isLoading: loadingUnavail } =
    useGetProviderUnavailability(providerId);

  const isLoading = loadingAvail || loadingOverrides || loadingUnavail;

  const availability = availData?.data;
  const overrides = overridesData?.data ?? [];
  const unavailabilities = unavailData?.data ?? [];

  const prevMonth = () => {
    setViewDate((prev) => {
      const d = new Date(prev.year, prev.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const nextMonth = () => {
    setViewDate((prev) => {
      const d = new Date(prev.year, prev.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const isPrevDisabled =
    viewDate.year === today.getFullYear() &&
    viewDate.month === today.getMonth();

  const monthDays = getMonthDays(viewDate.year, viewDate.month);
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay();
  const blanks = Array.from({ length: firstDayOfWeek });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#719FC4]" />
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">
        Availability not set by this provider yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={isPrevDisabled}
          className="p-2 rounded-xl border border-gray-200 bg-white hover:border-[#719FC4] disabled:opacity-30 disabled:cursor-default transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-black text-gray-900 tracking-tight">
          {MONTH_NAMES[viewDate.month]} {viewDate.year}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl border border-gray-200 bg-white hover:border-[#719FC4] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-bold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}

        {/* Blank cells for offset */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {/* Day cells */}
        {monthDays.map((date) => {
          const isPast = date < todayMidnight;
          new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isToday = date.toDateString() === today.toDateString();

          const status = isPast
            ? ({ type: "not_working" } as const)
            : resolveDayStatus(date, availability, overrides, unavailabilities);

          return (
            <div
              key={date.toISOString()}
              className={getDayStyle(status, isToday, isPast)}
            >
              <span className="text-xs">{date.getDate()}</span>
              {/* Dot indicator */}
              {!isPast && (
                <span
                  className={`absolute bottom-1.5 w-1 h-1 rounded-full ${
                    status.type === "available"
                      ? "bg-[#719FC4]"
                      : status.type === "unavailable"
                        ? "bg-red-400"
                        : "bg-transparent"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-2">
        {[
          {
            color: "bg-[#EEF5FB]",
            border: "border-[#719FC4]",
            label: "Available",
          },
          {
            color: "bg-red-50",
            border: "border-red-300",
            label: "Unavailable / Booked",
          },
          {
            color: "bg-gray-50",
            border: "border-gray-200",
            label: "Not Working",
          },
        ].map(({ color, border, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-md ${color} border ${border}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Timezone note */}
      <p className="text-xs text-gray-400">
        Times shown in provider's timezone:{" "}
        <span className="font-medium text-gray-500">
          {availability.timezone}
        </span>
      </p>
    </div>
  );
};
