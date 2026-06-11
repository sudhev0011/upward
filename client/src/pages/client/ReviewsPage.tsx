import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  usePendingReviewsQuery,
  useClientReviewsQuery,
  useCreateReviewMutation,
} from "@/hooks/reviews/useReviews";

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

  const { data: pendingRes, isLoading: isPendingLoading } =
    usePendingReviewsQuery(1, 100);
  const { data: clientReviewsRes, isLoading: isSubmittedLoading } =
    useClientReviewsQuery(1, 100);
  const createReviewMutation = useCreateReviewMutation();

  const handleCreateReview = async (bookingId: string) => {
    const rating = ratings[bookingId];
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    const comment = comments[bookingId]?.trim() || null;

    try {
      await createReviewMutation.mutateAsync({
        bookingId,
        rating,
        comment,
      });
      toast.success("Review submitted successfully!");
      // Clear state for this booking
      setRatings((prev) => {
        const copy = { ...prev };
        delete copy[bookingId];
        return copy;
      });
      setComments((prev) => {
        const copy = { ...prev };
        delete copy[bookingId];
        return copy;
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to submit review");
    }
  };

  const pending = pendingRes?.data?.data || [];
  const submitted = clientReviewsRes?.data?.data || [];

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

      {/* Pending Reviews */}
      {tab === "pending" && (
        <div className="flex flex-col gap-5">
          {isPendingLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#719FC4] h-8 w-8" />
            </div>
          ) : pending.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
              <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                All caught up! No pending reviews.
              </p>
            </div>
          ) : (
            pending.map((r) => {
              const avatarUrl = r.provider.avatarFileName;
              const providerName = r.provider?.name || "Provider";
              const serviceName = r.service?.name || "Service";
              const initials = providerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              const dateStr = r.bookingDate
                ? new Date(r.bookingDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Unknown Date";

              return (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6"
                >
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#719FC4] text-sm font-bold text-white overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={providerName ?? "Provider avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{serviceName}</p>
                      <p className="text-sm text-gray-400">
                        {providerName} · {dateStr} · ${r.totalAmount}
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
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
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
                    onClick={() => handleCreateReview(r.id)}
                    disabled={!ratings[r.id] || createReviewMutation.isPending}
                    className="flex items-center justify-center rounded-xl bg-[#719FC4] hover:bg-[#5585A8] disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
                  >
                    {createReviewMutation.isPending && (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    )}
                    Submit Review
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Submitted Reviews */}
      {tab === "submitted" && (
        <div className="flex flex-col gap-4">
          {isSubmittedLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#719FC4] h-8 w-8" />
            </div>
          ) : submitted.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
              <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No submitted reviews yet.</p>
            </div>
          ) : (
            submitted.map((r) => {
              const providerName = r.provider?.name || "Provider";
              const avatarUrl = r.provider?.avatar;
              const initials = providerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              const dateStr = r.createdAt
                ? new Date(r.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Unknown Date";

              return (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#719FC4] text-xs font-bold text-white overflow-hidden">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={providerName ?? "Provider avatar"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Service Review
                        </p>
                        <p className="text-xs text-gray-400">
                          {providerName} · {dateStr}
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
                  {r.comment && (
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{r.comment}"
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
