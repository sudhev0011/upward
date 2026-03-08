import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/useReveal";

const STEPS = [
  {
    num: "01",
    title: "Post your task",
    desc: "Tell us what you need in a few clicks. No calls, no paperwork — done in under 2 minutes.",
  },
  {
    num: "02",
    title: "Get matched",
    desc: "We instantly connect you with vetted, top-rated professionals who fit your needs.",
  },
  {
    num: "03",
    title: "Get it done",
    desc: "Work is completed on time. Pay only when you're 100% satisfied. Guaranteed.",
  },
];

export const HowItWorks = () => {
  const titleRef = useReveal(0);
  const stepRefs = [useReveal(0), useReveal(130), useReveal(260)];
  const ctaRef   = useReveal(0);

  return (
    <section id="process" className="bg-gray-50 py-24 px-4 md:px-6">
      <div className="container mx-auto">
        <div ref={titleRef} className="mb-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#719FC4]">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Three steps to done
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              ref={stepRefs[i]}
              className="relative rounded-2xl bg-white border border-gray-100 p-8 shadow-sm"
            >
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-12 -right-3 w-6 h-px bg-[#719FC4]/40 z-10" />
              )}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#719FC4] text-white text-sm font-black">
                  {step.num}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#719FC4]/40 to-transparent" />
              </div>
              <h3 className="mb-2.5 text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="mt-10 flex justify-center">
          <Link to="/register">
            <Button
              size="lg"
              className="gap-2 bg-[#719FC4] hover:bg-[#5585A8] text-white font-semibold px-10 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              Post a Task Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};