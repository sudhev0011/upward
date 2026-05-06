import { Shield, Zap, CheckCircle, Users, Clock, Star, LucideIcon } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  { icon: Shield,      title: "Vetted Professionals",   desc: "Every pro is background-checked and skill-verified before joining." },
  { icon: Zap,         title: "Matched in Minutes",      desc: "Our smart algorithm connects you with the right person fast." },
  { icon: CheckCircle, title: "Satisfaction Guaranteed", desc: "Not happy? We'll fix it or refund you — no questions asked." },
  { icon: Users,       title: "Dedicated Support",       desc: "Real humans available 7 days a week. No bots, no queues." },
  { icon: Clock,       title: "Transparent Pricing",     desc: "See exact costs upfront. Zero hidden fees, ever." },
  { icon: Star,        title: "Top 5% Network",          desc: "We accept only the most skilled professionals in every category." },
];

// 1. Create a child component for the individual card
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useReveal(index * 60); // Hook is now called at the top level of its own component

  return (
    <div
      ref={ref}
      className="group rounded-2xl border border-gray-100 bg-gray-50 p-7 transition-all duration-300 hover:bg-[#EAF2F9] hover:border-[#719FC4]/30"
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-[#719FC4] group-hover:bg-[#719FC4] group-hover:text-white transition-all duration-300">
        <feature.icon className="h-5 w-5" />
      </div>
      <h3 className="mb-1.5 font-bold text-gray-900">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{feature.desc}</p>
    </div>
  );
};

export const WhyUs = () => {
  const titleRef = useReveal(0);

  return (
    <section id="why-us" className="bg-white py-24 px-4 md:px-6">
      <div className="container mx-auto">
        <div ref={titleRef} className="mb-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#719FC4]">
            Why Upward
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Built different, by design
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};