import { useState } from "react";
import { Heart, Star, Trash2, Search } from "lucide-react";
export type ServiceCategory = "Onsite" | "Offsite" | "Dedicated";
const SAVED_PROS = [
  { id: "s1", name: "CleanPro",     initials: "CP", service: "Home Cleaning",    category: "Onsite"    as ServiceCategory, rating: 4.9, reviews: 512, price: "From $80",    saved: "2 days ago",   note: "Great for monthly deep clean" },
  { id: "s2", name: "CodeCraft",    initials: "CC", service: "React Dev",         category: "Offsite"   as ServiceCategory, rating: 4.8, reviews: 203, price: "From $75/h",  saved: "1 week ago",   note: "" },
  { id: "s3", name: "PixelStudio",  initials: "PS", service: "Brand Design",      category: "Offsite"   as ServiceCategory, rating: 4.9, reviews: 140, price: "From $120",   saved: "2 weeks ago",  note: "For next rebrand project" },
  { id: "s4", name: "CoolFix",      initials: "CF", service: "AC Maintenance",    category: "Onsite"    as ServiceCategory, rating: 4.8, reviews: 330, price: "From $70",    saved: "3 weeks ago",  note: "" },
  { id: "s5", name: "RankLab",      initials: "RL", service: "SEO Consulting",    category: "Offsite"   as ServiceCategory, rating: 4.7, reviews: 167, price: "From $90/h",  saved: "1 month ago",  note: "" },
  { id: "s6", name: "DevSquad",     initials: "DS", service: "Full-Stack Team",   category: "Dedicated" as ServiceCategory, rating: 4.9, reviews: 88,  price: "From $200/d", saved: "1 month ago",  note: "Potential long-term team" },
  { id: "s7", name: "BrushWorks",   initials: "BW", service: "Interior Painting", category: "Onsite"    as ServiceCategory, rating: 4.7, reviews: 445, price: "From $150",   saved: "2 months ago", note: "" },
];

const CATEGORY_STYLES: Record<ServiceCategory, string> = {
  Onsite:    "bg-[#EAF2F9] text-[#5585A8]",
  Offsite:   "bg-indigo-50  text-indigo-500",
  Dedicated: "bg-violet-50  text-violet-500",
};

const SavedPage = () => {
  const [search, setSearch] = useState("");
  const [saved, setSaved]   = useState(SAVED_PROS.map((p) => p.id));

  const visible = SAVED_PROS
    .filter((p) => saved.includes(p.id))
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.service.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Saved Pros</h1>
          <p className="text-sm text-gray-400 mt-0.5">{visible.length} professionals saved</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved pros…"
            className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-[#719FC4] focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20 transition-all"
          />
        </div>
      </div>

      {visible.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
          <Heart className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No saved pros yet. Explore services to save your favourites.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <div key={p.id} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#719FC4] text-sm font-bold text-white">
                  {p.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.service}</p>
                </div>
              </div>
              <button
                onClick={() => setSaved((prev) => prev.filter((id) => id !== p.id))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_STYLES[p.category]}`}>{p.category}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                <span className="text-xs text-gray-400">({p.reviews})</span>
              </div>
            </div>

            {p.note && (
              <p className="text-xs text-gray-400 italic mb-3 bg-gray-50 rounded-lg px-3 py-2">
                "{p.note}"
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-900">{p.price}</p>
                <p className="text-[11px] text-gray-400">Saved {p.saved}</p>
              </div>
              <button className="rounded-xl bg-[#719FC4] hover:bg-[#5585A8] px-4 py-2 text-xs font-bold text-white transition-all shadow-sm hover:shadow-md">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPage;