import { useState } from "react";
import { Star, ArrowRight, MoreHorizontal } from "lucide-react";

export type BookingStatus = "active" | "pending" | "completed" | "cancelled";
export type ServiceCategory = "Onsite" | "Offsite" | "Dedicated";


export interface Booking {
  id: string;
  title: string;
  provider: string;
  providerInitials: string;
  category: ServiceCategory;
  status: BookingStatus;
  date: string;
  time: string;
  price: number;
  rating?: number;
}
export const BOOKINGS: Booking[] = [
  { id: "b1", title: "Home Deep Cleaning",     provider: "Sarah M.",   providerInitials: "SM", category: "Onsite",    status: "active",    date: "Mar 11, 2026", time: "10:00 AM", price: 180 },
  { id: "b2", title: "React Dashboard Dev",    provider: "Luca T.",    providerInitials: "LT", category: "Offsite",   status: "active",    date: "Mar 12, 2026", time: "2:00 PM",  price: 640 },
  { id: "b3", title: "Plumbing Repair",        provider: "Mike D.",    providerInitials: "MD", category: "Onsite",    status: "pending",   date: "Mar 14, 2026", time: "9:00 AM",  price: 120 },
  { id: "b4", title: "Logo & Brand Design",    provider: "Priya K.",   providerInitials: "PK", category: "Offsite",   status: "completed", date: "Feb 28, 2026", time: "All day",  price: 420, rating: 5 },
  { id: "b5", title: "Electrical Inspection",  provider: "Tom R.",     providerInitials: "TR", category: "Onsite",    status: "completed", date: "Feb 20, 2026", time: "11:00 AM", price: 95,  rating: 4 },
  { id: "b6", title: "Full-Stack Team (x3)",   provider: "Dev Squad",  providerInitials: "DS", category: "Dedicated", status: "active",    date: "Mar 1–31",     time: "Ongoing",  price: 4200 },
];
const STATUS_STYLES: Record<BookingStatus, string> = {
  active:    "bg-emerald-50  text-emerald-600  border-emerald-200",
  pending:   "bg-amber-50    text-amber-600    border-amber-200",
  completed: "bg-gray-100    text-gray-500     border-gray-200",
  cancelled: "bg-red-50      text-red-500      border-red-200",
};

const CATEGORY_STYLES: Record<ServiceCategory, string> = {
  Onsite:    "bg-[#EAF2F9] text-[#5585A8]",
  Offsite:   "bg-indigo-50  text-indigo-500",
  Dedicated: "bg-violet-50  text-violet-500",
};

const FILTERS: Array<BookingStatus | "all"> = ["all", "active", "pending", "completed", "cancelled"];

export const BookingsTable = () => {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const visible = filter === "all" ? BOOKINGS : BOOKINGS.filter((b) => b.status === filter);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">My Bookings</h2>
          <p className="text-xs text-gray-400 mt-0.5">{BOOKINGS.length} total bookings</p>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-150 ${
                filter === f
                  ? "bg-[#719FC4] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              {["Service", "Provider", "Category", "Date & Time", "Price", "Status", ""].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map((b) => (
              <tr key={b.id} className="group hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{b.title}</p>
                  {b.rating && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: b.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#719FC4] text-[10px] font-bold text-white flex-shrink-0">
                      {b.providerInitials}
                    </div>
                    <span className="text-gray-700">{b.provider}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_STYLES[b.category]}`}>
                    {b.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">{b.date}</p>
                  <p className="text-xs text-gray-400">{b.time}</p>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  ${b.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden divide-y divide-gray-50">
        {visible.map((b) => (
          <div key={b.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_STYLES[b.category]}`}>
                    {b.category}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900">${b.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#719FC4] text-[9px] font-bold text-white">
                  {b.providerInitials}
                </div>
                <span className="text-xs text-gray-500">{b.provider}</span>
              </div>
              <span className="text-xs text-gray-400">{b.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
        <p className="text-xs text-gray-400">Showing {visible.length} of {BOOKINGS.length}</p>
        <button className="flex items-center gap-1 text-xs font-semibold text-[#719FC4] hover:text-[#5585A8] transition-colors">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};