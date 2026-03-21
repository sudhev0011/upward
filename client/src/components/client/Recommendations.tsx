import { Star, ArrowRight } from "lucide-react";

export type ServiceCategory = "Onsite" | "Offsite" | "Dedicated";
export interface Recommendation {
  id: string;
  title: string;
  provider: string;
  providerInitials: string;
  category: ServiceCategory;
  rating: number;
  reviews: number;
  price: string;
  badge?: string;
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r1",
    title: "AC Maintenance",
    provider: "Cool Fix Pro",
    providerInitials: "CF",
    category: "Onsite",
    rating: 4.9,
    reviews: 312,
    price: "From $89",
    badge: "Top Rated",
  },
  {
    id: "r2",
    title: "SEO Consulting",
    provider: "Rank Studio",
    providerInitials: "RS",
    category: "Offsite",
    rating: 4.8,
    reviews: 198,
    price: "From $120/h",
  },
  {
    id: "r3",
    title: "Interior Painting",
    provider: "BrushWorks",
    providerInitials: "BW",
    category: "Onsite",
    rating: 4.7,
    reviews: 445,
    price: "From $150",
    badge: "Popular",
  },
  {
    id: "r4",
    title: "Mobile App Dev",
    provider: "AppCraft",
    providerInitials: "AC",
    category: "Offsite",
    rating: 4.9,
    reviews: 87,
    price: "From $80/h",
    badge: "New",
  },
];
const CATEGORY_STYLES: Record<ServiceCategory, string> = {
  Onsite: "bg-[#EAF2F9] text-[#5585A8]",
  Offsite: "bg-indigo-50  text-indigo-500",
  Dedicated: "bg-violet-50  text-violet-500",
};

const BADGE_STYLES: Record<string, string> = {
  "Top Rated": "bg-amber-50   text-amber-600",
  Popular: "bg-emerald-50 text-emerald-600",
  New: "bg-[#EAF2F9]  text-[#5585A8]",
};

export const Recommendations = () => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div>
        <h2 className="text-base font-bold text-gray-900">
          Recommended for You
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Based on your history</p>
      </div>
      <button className="text-xs font-semibold text-[#719FC4] hover:text-[#5585A8] transition-colors flex items-center gap-1">
        Browse all <ArrowRight className="h-3 w-3" />
      </button>
    </div>

    <div className="divide-y divide-gray-50">
      {RECOMMENDATIONS.map((r) => (
        <div
          key={r.id}
          className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
        >
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#719FC4] text-xs font-bold text-white">
            {r.providerInitials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-900">{r.title}</p>
              {r.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${BADGE_STYLES[r.badge] ?? ""}`}
                >
                  {r.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{r.provider}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_STYLES[r.category]}`}
              >
                {r.category}
              </span>
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-gray-600">
                  {r.rating}
                </span>
                <span className="text-xs text-gray-400">({r.reviews})</span>
              </div>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-gray-900">{r.price}</p>
            <button className="mt-1.5 rounded-lg bg-[#EAF2F9] hover:bg-[#719FC4] px-3 py-1.5 text-xs font-semibold text-[#5585A8] hover:text-white transition-all duration-200">
              Book
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
