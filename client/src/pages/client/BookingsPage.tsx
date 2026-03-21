import { useState } from "react";
import { Plus, Search, Filter, Star, Calendar, Clock } from "lucide-react";
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
  {
    id: "b1",
    title: "Home Deep Cleaning",
    provider: "Sarah M.",
    providerInitials: "SM",
    category: "Onsite",
    status: "active",
    date: "Mar 11, 2026",
    time: "10:00 AM",
    price: 180,
  },
  {
    id: "b2",
    title: "React Dashboard Dev",
    provider: "Luca T.",
    providerInitials: "LT",
    category: "Offsite",
    status: "active",
    date: "Mar 12, 2026",
    time: "2:00 PM",
    price: 640,
  },
  {
    id: "b3",
    title: "Plumbing Repair",
    provider: "Mike D.",
    providerInitials: "MD",
    category: "Onsite",
    status: "pending",
    date: "Mar 14, 2026",
    time: "9:00 AM",
    price: 120,
  },
  {
    id: "b4",
    title: "Logo & Brand Design",
    provider: "Priya K.",
    providerInitials: "PK",
    category: "Offsite",
    status: "completed",
    date: "Feb 28, 2026",
    time: "All day",
    price: 420,
    rating: 5,
  },
  {
    id: "b5",
    title: "Electrical Inspection",
    provider: "Tom R.",
    providerInitials: "TR",
    category: "Onsite",
    status: "completed",
    date: "Feb 20, 2026",
    time: "11:00 AM",
    price: 95,
    rating: 4,
  },
  {
    id: "b6",
    title: "Full-Stack Team (x3)",
    provider: "Dev Squad",
    providerInitials: "DS",
    category: "Dedicated",
    status: "active",
    date: "Mar 1–31",
    time: "Ongoing",
    price: 4200,
  },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  active: "bg-emerald-50  text-emerald-600  border-emerald-200",
  pending: "bg-amber-50    text-amber-600    border-amber-200",
  completed: "bg-gray-100    text-gray-500     border-gray-200",
  cancelled: "bg-red-50      text-red-500      border-red-200",
};

const CATEGORY_STYLES: Record<ServiceCategory, string> = {
  Onsite: "bg-[#EAF2F9] text-[#5585A8]",
  Offsite: "bg-indigo-50  text-indigo-500",
  Dedicated: "bg-violet-50  text-violet-500",
};

const FILTERS: Array<BookingStatus | "all"> = [
  "all",
  "active",
  "pending",
  "completed",
  "cancelled",
];

const BookingsPage = () => {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const visible = BOOKINGS.filter(
    (b) => filter === "all" || b.status === filter,
  ).filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.provider.toLowerCase().includes(search.toLowerCase()),
  );

  const detail = BOOKINGS.find((b) => b.id === selected);

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            My Bookings
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {BOOKINGS.length} total bookings
          </p>
        </div>
        <button className="flex items-center gap-2 self-start sm:self-auto rounded-xl bg-[#719FC4] hover:bg-[#5585A8] px-5 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md">
          <Plus className="h-4 w-4" /> New Booking
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings or providers…"
            className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-[#719FC4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-[#719FC4] text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid gap-5 ${selected ? "lg:grid-cols-3" : "grid-cols-1"}`}
      >
        {/* Card list */}
        <div
          className={`flex flex-col gap-3 ${selected ? "lg:col-span-2" : ""}`}
        >
          {visible.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-400 text-sm">
              No bookings match your filters.
            </div>
          )}
          {visible.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelected(selected === b.id ? null : b.id)}
              className={`cursor-pointer rounded-2xl border bg-white p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                selected === b.id
                  ? "border-[#719FC4]/40 shadow-md"
                  : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#719FC4] text-xs font-bold text-white">
                    {b.providerInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {b.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{b.provider}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_STYLES[b.category]}`}
                      >
                        {b.category}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[b.status]}`}
                      >
                        {b.status}
                      </span>
                      {b.rating && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: b.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-extrabold tracking-tight text-gray-900">
                    ${b.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 justify-end">
                    <Calendar className="h-3 w-3" />
                    {b.date}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 justify-end">
                    <Clock className="h-3 w-3" />
                    {b.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#719FC4] text-sm font-bold text-white">
                {detail.providerInitials}
              </div>
              <div>
                <p className="font-bold text-gray-900">{detail.provider}</p>
                <p className="text-xs text-gray-400">
                  {detail.category} Service
                </p>
              </div>
            </div>
            {[
              { label: "Service", value: detail.title },
              { label: "Date", value: detail.date },
              { label: "Time", value: detail.time },
              { label: "Price", value: `$${detail.price.toLocaleString()}` },
              { label: "Status", value: detail.status },
              { label: "Category", value: detail.category },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {label}
                </span>
                <span className="text-sm font-semibold text-gray-800 capitalize">
                  {value}
                </span>
              </div>
            ))}
            <div className="mt-5 flex flex-col gap-2">
              <button className="w-full rounded-xl bg-[#719FC4] hover:bg-[#5585A8] py-2.5 text-sm font-bold text-white transition-all">
                Message Provider
              </button>
              {detail.status === "active" && (
                <button className="w-full rounded-xl border border-red-200 text-red-500 hover:bg-red-50 py-2.5 text-sm font-semibold transition-all">
                  Cancel Booking
                </button>
              )}
              {detail.status === "completed" && !detail.rating && (
                <button className="w-full rounded-xl border border-amber-200 text-amber-600 hover:bg-amber-50 py-2.5 text-sm font-semibold transition-all">
                  Leave a Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
