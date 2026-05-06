import { format } from "date-fns";

// "09:00" → "9:00 AM" | "13:30" → "1:30 PM"
export const to12h = (time: string | null): string => {
  if (!time) return "9:00 AM";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

// Date → "YYYY-MM-DD"
export const toDateString = (date: Date): string => format(date, "yyyy-MM-dd");

// "YYYY-MM-DD" → Date at local midnight (avoids UTC shift)
export const fromDateString = (str: string): Date => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};