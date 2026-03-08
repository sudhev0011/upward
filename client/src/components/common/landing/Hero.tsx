import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/useReveal";

const AVATARS = ["SK", "JR", "PM", "DC", "AT"];

export const Hero = () => {
  const badge   = useReveal(0);
  const heading = useReveal(100);
  const sub     = useReveal(220);
  const ctas    = useReveal(340);
  const stats   = useReveal(460);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#e8f2fa 1px, transparent 1px), linear-gradient(90deg, #e8f2fa 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.45,
        }}
      />
      {/* Radial fade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(113,159,196,0.12),transparent)]" />

      <div className="container relative mx-auto px-4 md:px-6 pt-24 pb-28 flex flex-col items-center text-center">
        {/* Badge */}
        <div ref={badge} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#719FC4]/30 bg-[#EAF2F9] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#719FC4] animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-[#5585A8]">
            Trusted by 10,000+ customers
          </span>
        </div>

        {/* Heading */}
        <h1
          ref={heading}
          className="max-w-3xl text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.05] tracking-tight text-gray-900"
        >
          Get any job done with{" "}
          <span className="relative inline-block text-[#719FC4]">
            Upward
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M1 5.5C50 1.5 150 1.5 199 5.5"
                stroke="#719FC4"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </span>
        </h1>

        {/* Subheading */}
        <p ref={sub} className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
          Your all-in-one platform for onsite &amp; offsite services. Connect
          with vetted professionals and get things done — fast, reliably, and on
          your terms.
        </p>

        {/* CTAs */}
        <div ref={ctas} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register">
            <Button
              size="lg"
              className="gap-2 bg-[#719FC4] hover:bg-[#5585A8] text-white font-semibold px-8 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/services">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-gray-200 text-gray-700 font-semibold px-8 hover:border-[#719FC4] hover:text-[#719FC4] transition-all duration-200 rounded-xl"
            >
              Browse Services
            </Button>
          </Link>
        </div>

        {/* Social proof */}
        <div ref={stats} className="mt-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {AVATARS.map((init, i) => (
              <div
                key={init}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#719FC4] text-[10px] font-bold text-white"
                style={{ zIndex: 5 - i }}
              >
                {init}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">4.9 / 5</span> from 2,000+ pros
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};