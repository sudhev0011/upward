import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Homeowner, New York",
    text: "Upward sent a plumber within hours. The work was exceptional and the process completely seamless.",
    init: "SK",
    tag: "Onsite",
  },
  {
    name: "James R.",
    role: "Startup Founder, London",
    text: "Their remote dev team built our MVP in under 3 weeks. Perfect communication, ahead of schedule.",
    init: "JR",
    tag: "Offsite",
  },
  {
    name: "Priya M.",
    role: "Property Manager, Chicago",
    text: "I rely on Upward for all my maintenance needs across 12 properties. Not a single disappointment.",
    init: "PM",
    tag: "Onsite",
  },
  {
    name: "Daniel C.",
    role: "Restaurant Owner, Miami",
    text: "The kitchen renovation team was outstanding. Professional, punctual, quality exceeded expectations.",
    init: "DC",
    tag: "Onsite",
  },
  {
    name: "Aisha T.",
    role: "Marketing Director, Toronto",
    text: "We hired a design team for our rebrand. Six months in and still working with them. Incredible.",
    init: "AT",
    tag: "Dedicated",
  },
  {
    name: "Marco B.",
    role: "Tech Lead, Berlin",
    text: "Fastest way to find quality contractors. No fluff, just reliable professionals who deliver.",
    init: "MB",
    tag: "Offsite",
  },
];

export const Testimonials = () => {
  const [active, setActive] = useState(0);
  const titleRef = useReveal(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((p) => (p + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section id="reviews" className="bg-gray-50 py-24 px-4 md:px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div
          ref={titleRef}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#719FC4]">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Real results,
              <br />
              real people
            </h2>
          </div>
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 border-0 cursor-pointer ${
                  i === active ? "w-7 bg-[#719FC4]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              onClick={() => setActive(i)}
              className={`cursor-pointer rounded-2xl border bg-white p-7 transition-all duration-300 ${
                i === active
                  ? "border-[#719FC4]/40 shadow-md shadow-[#719FC4]/10 -translate-y-1"
                  : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Tag */}
              <span
                className={`mb-4 inline-block rounded-full px-3 py-0.5 text-xs font-bold transition-all duration-300 ${
                  i === active
                    ? "bg-[#719FC4] text-white"
                    : "bg-[#EAF2F9] text-[#5585A8]"
                }`}
              >
                {t.tag}
              </span>

              <p className="mb-5 text-sm leading-relaxed text-gray-500 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    i === active
                      ? "bg-[#719FC4] text-white"
                      : "bg-[#EAF2F9] text-[#719FC4]"
                  }`}
                >
                  {t.init}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
