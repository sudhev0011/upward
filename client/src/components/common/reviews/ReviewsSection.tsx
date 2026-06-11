import { Star, Loader2 } from "lucide-react";
import { useProviderReviewsQuery } from "@/hooks/reviews/useReviews";

interface ReviewsSectionProps {
  providerId: string;
}

export const ReviewsSection = ({ providerId }: ReviewsSectionProps) => {
  const { data: reviewsRes, isLoading } = useProviderReviewsQuery(providerId, 1, 100);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-[#719FC4] h-8 w-8" />
      </div>
    );
  }

  const reviews = reviewsRes?.data?.data || [];
  const total = reviewsRes?.data?.total || 0;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <Star className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-semibold">No reviews yet</p>
        <p className="text-gray-400 text-xs mt-1">
          Reviews from clients will appear here once bookings are completed.
        </p>
      </div>
    );
  }

  // Calculate rating stats
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = total > 0 ? (totalRating / reviews.length).toFixed(1) : "0.0";

  const counts = [0, 0, 0, 0, 0]; // indices 0 to 4 represent 5 to 1 stars
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[5 - star]++;
  });

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-gray-100">
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-gray-100">
          <span className="text-5xl font-black text-gray-900">{avgRating}</span>
          <div className="flex items-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-5 w-5 ${
                  n <= Math.round(Number(avgRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 mt-2 font-medium">
            Based on {total} {total === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="col-span-2 flex flex-col justify-center space-y-2.5">
          {counts.map((count, index) => {
            const stars = 5 - index;
            const percentage = total > 0 ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-sm">
                <span className="w-3 text-right font-bold text-gray-600">{stars}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-gray-400 font-bold">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          Client Feedback ({total})
        </h3>
        <div className="flex flex-col gap-4">
          {reviews.map((r) => {
            const clientName = r.client?.name || "Client";
            const initials = clientName
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
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#719FC4]/10 text-[#4A86B0] text-sm font-black">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{clientName}</p>
                      <p className="text-xs text-gray-400">{dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-4 w-4 ${
                          n <= r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200"
                        }`}
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
          })}
        </div>
      </div>
    </div>
  );
};
