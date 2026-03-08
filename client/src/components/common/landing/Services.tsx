import { ArrowRight } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

const SERVICES = [
  {
    title: "Onsite Services",
    desc: "Plumbing, electrical, cleaning, repairs — skilled pros come directly to you.",
    tags: ["Plumbing", "Electrical", "Cleaning", "Repairs"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "Offsite Services",
    desc: "Design, development, consulting — expert work delivered remotely.",
    tags: ["Development", "Design", "Consulting", "Marketing"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Dedicated Teams",
    desc: "Hire full teams for large projects, managed end-to-end by Upward.",
    tags: ["Full-Stack", "Management", "Long-term"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export const Services = () => {
  const titleRef = useReveal(0);
  const cardRefs = [useReveal(0), useReveal(120), useReveal(240)];

  return (
    <section id="services" className="bg-white py-24 px-4 md:px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div ref={titleRef} className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#719FC4]">
              What We Offer
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Services built<br />for every need
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-gray-500">
            Whether it's hands-on work at your door or expert help from anywhere — we've got you covered.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              ref={cardRefs[i]}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#719FC4]/30"
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-[#719FC4] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />

              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2F9] text-[#719FC4]">
                {s.icon}
              </div>

              <h3 className="mb-2.5 text-xl font-bold text-gray-900">{s.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-500">{s.desc}</p>

              <div className="mb-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#719FC4]">
                Explore
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};