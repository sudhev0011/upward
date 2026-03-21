import { useState } from "react";
import { Star } from "lucide-react";

const PENDING_REVIEWS = [
  {
    id: "pr1",
    title: "Electrical Inspection",
    provider: "Tom R.",
    initials: "TR",
    date: "Feb 20, 2026",
    price: 95,
  },
  {
    id: "pr2",
    title: "Interior Painting",
    provider: "Mike B.",
    initials: "MB",
    date: "Jan 8, 2026",
    price: 340,
  },
];

const SUBMITTED_REVIEWS = [
  {
    id: "sr1",
    title: "Logo & Brand Design",
    provider: "Priya K.",
    initials: "PK",
    rating: 5,
    date: "Mar 1, 2026",
    comment:
      "Absolutely stunning work. Priya captured our brand perfectly and delivered ahead of schedule. Highly recommended!",
  },
  {
    id: "sr2",
    title: "Home Deep Cleaning",
    provider: "Sarah M.",
    initials: "SM",
    rating: 4,
    date: "Feb 5, 2026",
    comment:
      "Very thorough and professional. The apartment was spotless. Minor issue with timing but otherwise great.",
  },
  {
    id: "sr3",
    title: "AC Maintenance",
    provider: "CoolFix",
    initials: "CF",
    rating: 5,
    date: "Jan 20, 2026",
    comment:
      "Fast, efficient and friendly. Fixed the issue on the first visit. Will definitely book again.",
  },
];

const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        onClick={() => onChange(n)}
        className="transition-transform hover:scale-110"
      >
        <Star
          className={`h-7 w-7 ${n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      </button>
    ))}
  </div>
);

const ReviewsPage = () => {
  const [tab, setTab] = useState<"pending" | "submitted">("pending");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string[]>([]);

  const handleSubmit = (id: string) => {
    if (!ratings[id]) return;
    setSubmitted((p) => [...p, id]);
  };

  const pending = PENDING_REVIEWS.filter((r) => !submitted.includes(r.id));

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Reviews
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Rate your experiences and help the community
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {(["pending", "submitted"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-all ${
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
            {t === "pending" && pending.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#719FC4] text-[10px] font-bold text-white">
                {pending.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending */}
      {tab === "pending" && (
        <div className="flex flex-col gap-5">
          {pending.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
              <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                All caught up! No pending reviews.
              </p>
            </div>
          )}
          {pending.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#719FC4] text-sm font-bold text-white">
                  {r.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{r.title}</p>
                  <p className="text-sm text-gray-400">
                    {r.provider} · {r.date} · ${r.price}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Your Rating
                </p>
                <StarPicker
                  value={ratings[r.id] ?? 0}
                  onChange={(v) => setRatings((p) => ({ ...p, [r.id]: v }))}
                />
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Your Review{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </p>
                <textarea
                  value={comments[r.id] ?? ""}
                  onChange={(e) =>
                    setComments((p) => ({ ...p, [r.id]: e.target.value }))
                  }
                  placeholder="Share your experience…"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:border-[#719FC4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20 transition-all"
                />
              </div>
              <button
                onClick={() => handleSubmit(r.id)}
                disabled={!ratings[r.id]}
                className="rounded-xl bg-[#719FC4] hover:bg-[#5585A8] disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
              >
                Submit Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submitted */}
      {tab === "submitted" && (
        <div className="flex flex-col gap-4">
          {SUBMITTED_REVIEWS.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#719FC4] text-xs font-bold text-white">
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{r.title}</p>
                    <p className="text-xs text-gray-400">
                      {r.provider} · {r.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${n <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "{r.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
