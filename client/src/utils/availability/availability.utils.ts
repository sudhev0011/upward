import { format } from "date-fns";
import { AvailabilityResponse } from "@/interfaces/provider/availability.interface";
import { AvailabilityOverride } from "@/interfaces/provider/availability-override.interface";
import { Unavailability } from "@/interfaces/provider/unavailability.interface";

export const to12h = (time: string | null): string => {
  if (!time) return "9:00 AM";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

export const toDateString = (date: Date): string => format(date, "yyyy-MM-dd");

export const fromDateString = (str: string): Date => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export type DayStatus =
  | { type: "available"; startTime: string; endTime: string }
  | { type: "unavailable"; reason?: string }
  | { type: "not_working" };

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function resolveDayStatus(
  date: Date,
  availability: AvailabilityResponse,
  overrides: AvailabilityOverride[],
  unavailabilities: Unavailability[],
): DayStatus {
  const dateStr = date.toISOString().split("T")[0];

  const unavail = unavailabilities.find((u) => {
    const start = new Date(u.startDate);
    const end = new Date(u.endDate);
    return date >= start && date <= end;
  });
  if (unavail) {
    return { type: "unavailable", reason: unavail.reason ?? undefined };
  }

  const override = overrides.find((o) => o.date === dateStr);
  if (override) {
    if (!override.isWorking) return { type: "unavailable" };
    if (override.startTime && override.endTime) {
      return {
        type: "available",
        startTime: override.startTime,
        endTime: override.endTime,
      };
    }
  }

  const dayName = DAYS[date.getDay()];
  const schedule = availability.weeklySchedule[dayName];

  if (!schedule.isWorking) return { type: "not_working" };
  if (schedule.startTime && schedule.endTime) {
    return {
      type: "available",
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    };
  }
  return { type: "not_working" };
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
