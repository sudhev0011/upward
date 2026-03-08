import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/useReveal";

const TRUST_ITEMS = ["No credit card", "Cancel anytime", "24/7 support"];

export const CTABanner = () => {
  const ref = useReveal(0);

  return (
    <section className="bg-white py-24 px-4 md:px-6">
      <div className="container mx-auto">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl bg-[#719FC4] px-8 py-16 md:px-16 md:py-20 text-center"
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5" />

          <div className="relative">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
              Get started today
            </p>
            <h2 className="mb-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to level up?
            </h2>
            <p className="mb-10 mx-auto max-w-md text-base text-white/75 leading-relaxed">
              Join thousands of satisfied customers. Get matched with a top
              professional today — no commitment required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-[#719FC4] hover:bg-gray-50 font-bold px-9 shadow-lg transition-all duration-200 rounded-xl hover:-translate-y-px"
                >
                  Get Started Free <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white/85 hover:text-white hover:bg-white/15 font-semibold px-9 rounded-xl border border-white/25 hover:border-white/50 transition-all duration-200"
                >
                  Browse Services
                </Button>
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {TRUST_ITEMS.map((it) => (
                <div key={it} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">{it}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};