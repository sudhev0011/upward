import { useState } from "react";
import { Search, Star, SlidersHorizontal, MapPin, Monitor, Users } from "lucide-react";
export type ServiceCategory = "Onsite" | "Offsite" | "Dedicated";
const SERVICES = [
  { id: "e1",  title: "Home Deep Cleaning",    provider: "CleanPro",      initials: "CP", category: "Onsite"    as ServiceCategory, rating: 4.9, reviews: 512, price: "From $80",   tags: ["Cleaning", "Home"],         badge: "Top Rated" },
  { id: "e2",  title: "React / Next.js Dev",   provider: "CodeCraft",     initials: "CC", category: "Offsite"   as ServiceCategory, rating: 4.8, reviews: 203, price: "From $75/h", tags: ["Development", "React"],     badge: "Popular"  },
  { id: "e3",  title: "Plumbing Repairs",      provider: "PipeWorks",     initials: "PW", category: "Onsite"    as ServiceCategory, rating: 4.7, reviews: 389, price: "From $60",   tags: ["Plumbing", "Repairs"]                         },
  { id: "e4",  title: "Brand & Logo Design",   provider: "PixelStudio",   initials: "PS", category: "Offsite"   as ServiceCategory, rating: 4.9, reviews: 140, price: "From $120",  tags: ["Design", "Branding"],       badge: "New"      },
  { id: "e5",  title: "Electrical Inspection", provider: "VoltCheck",     initials: "VC", category: "Onsite"    as ServiceCategory, rating: 4.6, reviews: 271, price: "From $55",   tags: ["Electrical", "Safety"]                        },
  { id: "e6",  title: "Full-Stack Dev Team",   provider: "DevSquad",      initials: "DS", category: "Dedicated" as ServiceCategory, rating: 4.9, reviews: 88,  price: "From $200/d",tags: ["Team", "Full-Stack"],       badge: "Top Rated"},
  { id: "e7",  title: "SEO & Content",         provider: "RankLab",       initials: "RL", category: "Offsite"   as ServiceCategory, rating: 4.7, reviews: 167, price: "From $90/h", tags: ["SEO", "Marketing"]                            },
  { id: "e8",  title: "AC Maintenance",        provider: "CoolFix",       initials: "CF", category: "Onsite"    as ServiceCategory, rating: 4.8, reviews: 330, price: "From $70",   tags: ["HVAC", "Maintenance"],      badge: "Popular"  },
  { id: "e9",  title: "Interior Painting",     provider: "BrushWorks",    initials: "BW", category: "Onsite"    as ServiceCategory, rating: 4.7, reviews: 445, price: "From $150",  tags: ["Painting", "Interior"]                        },
];

const CATEGORY_STYLES: Record<ServiceCategory, string> = {
  Onsite:    "bg-[#EAF2F9] text-[#5585A8]",
  Offsite:   "bg-indigo-50  text-indigo-500",
  Dedicated: "bg-violet-50  text-violet-500",
};

const CATEGORY_ICONS: Record<ServiceCategory, typeof MapPin> = {
  Onsite:    MapPin,
  Offsite:   Monitor,
  Dedicated: Users,
};

const BADGE_STYLES: Record<string, string> = {
  "Top Rated": "bg-amber-50 text-amber-600",
  "Popular":   "bg-emerald-50 text-emerald-600",
  "New":       "bg-[#EAF2F9] text-[#5585A8]",
};

const CATS: Array<ServiceCategory | "All"> = ["All", "Onsite", "Offsite", "Dedicated"];

const ExplorePage = () => {
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState<ServiceCategory | "All">("All");
  const [sortBy, setSortBy]   = useState<"rating" | "reviews" | "price">("rating");

  const visible = SERVICES
    .filter((s) => cat === "All" || s.category === cat)
    .filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "rating")  return b.rating  - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Explore Services</h1>
        <p className="text-sm text-gray-400 mt-0.5">Find the perfect professional for any job</p>
      </div>

      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services, skills, tags…"
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-[#719FC4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 focus:border-[#719FC4] focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20"
          >
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              cat === c ? "bg-[#719FC4] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-[#719FC4]/40 hover:text-[#719FC4]"
            }`}
          >
            {c !== "All" && (() => { const Icon = CATEGORY_ICONS[c as ServiceCategory]; return <Icon className="h-3.5 w-3.5" />; })()}
            {c}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{visible.length} services</span>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <div
            key={s.id}
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#719FC4]/30 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#719FC4] text-sm font-bold text-white">
                {s.initials}
              </div>
              {s.badge && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${BADGE_STYLES[s.badge]}`}>{s.badge}</span>
              )}
            </div>

            <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
            <p className="text-sm text-gray-400 mb-3">{s.provider}</p>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_STYLES[s.category]}`}>{s.category}</span>
              {s.tags.slice(0, 2).map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">{t}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-800">{s.rating}</span>
                <span className="text-xs text-gray-400">({s.reviews})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{s.price}</span>
                <button className="rounded-lg bg-[#EAF2F9] hover:bg-[#719FC4] px-3 py-1.5 text-xs font-bold text-[#5585A8] hover:text-white transition-all duration-200">
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;