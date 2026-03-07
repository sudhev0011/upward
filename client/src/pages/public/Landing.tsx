// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   ArrowRight,
//   Wrench,
//   Monitor,
//   Users,
//   Star,
//   CheckCircle2,
//   Zap,
//   Shield,
//   Clock,
//   Sparkles,
//   TrendingUp,
// } from "lucide-react";

// const services = [
//   {
//     icon: Wrench,
//     title: "Onsite Services",
//     description:
//       "Plumbing, electrical, cleaning, repairs — skilled pros come to you.",
//     color: "from-blue-500 to-blue-600",
//   },
//   {
//     icon: Monitor,
//     title: "Offsite Services",
//     description:
//       "Design, development, consulting — expert work delivered remotely.",
//     color: "from-purple-500 to-purple-600",
//   },
//   {
//     icon: Users,
//     title: "Dedicated Teams",
//     description:
//       "Hire full teams for large projects, managed end-to-end by Upward.",
//     color: "from-cyan-500 to-cyan-600",
//   },
// ];

// const steps = [
//   {
//     num: "01",
//     title: "Tell Us What You Need",
//     description: "Describe your project or task in a few clicks.",
//     icon: "📝",
//   },
//   {
//     num: "02",
//     title: "Get Matched",
//     description: "We connect you with vetted, top-rated professionals.",
//     icon: "🎯",
//   },
//   {
//     num: "03",
//     title: "Get It Done",
//     description: "Work gets completed on time, every time. Guaranteed.",
//     icon: "✅",
//   },
// ];

// const testimonials = [
//   {
//     name: "Sarah K.",
//     role: "Homeowner",
//     text: "Upward sent a plumber within hours. Incredible speed and quality!",
//     rating: 5,
//     avatar: "SK",
//   },
//   {
//     name: "James R.",
//     role: "Startup Founder",
//     text: "Their remote dev team built our MVP in 3 weeks. Total game-changer.",
//     rating: 5,
//     avatar: "JR",
//   },
//   {
//     name: "Priya M.",
//     role: "Property Manager",
//     text: "I use Upward for all my maintenance needs. Reliable every single time.",
//     rating: 5,
//     avatar: "PM",
//   },
// ];

// const stats = [
//   { value: "10K+", label: "Tasks Completed", icon: TrendingUp },
//   { value: "2K+", label: "Verified Pros", icon: Users },
//   { value: "4.9", label: "Average Rating", icon: Star },
//   { value: "50+", label: "Service Categories", icon: Sparkles },
// ];

// const features = [
//   { icon: Shield, title: "Vetted Professionals", desc: "Every pro is background-checked and skill-verified." },
//   { icon: Clock, title: "Fast Turnaround", desc: "Get matched within minutes, work started within hours." },
//   { icon: CheckCircle2, title: "Satisfaction Guaranteed", desc: "Not happy? We'll make it right or refund you." },
// ];

// const LandingPage = () => {
//   return (
//     <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-slate-50/30">
//       <main className="flex-1">
//         {/* Hero */}
//         <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
//           <div className="absolute inset-0 overflow-hidden">
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
//             <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
//           </div>
//           <div className="container relative z-10 flex flex-col items-center text-center px-4">
//             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700">
//               <Zap className="h-4 w-4" /> Now serving 50+ categories
//             </div>
//             <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground">
//               Get Things Done with{" "}
//               <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Upward
//               </span>
//             </h1>
//             <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
//               Your all-in-one platform for onsite &amp; offsite services. From home
//               repairs to remote development — we match you with top professionals in minutes.
//             </p>
//             <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
//               <Button
//                 size="lg"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-base px-8 w-full sm:w-auto"
//               >
//                 Get Started <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="border-border/50 font-semibold text-base px-8 w-full sm:w-auto hover:bg-muted/50"
//               >
//                 Browse Services
//               </Button>
//             </div>
//           </div>
//         </section>

//         {/* Stats */}
//         <section className="border-y border-border/40 bg-white/50 backdrop-blur-sm">
//           <div className="container grid grid-cols-2 gap-6 py-16 md:grid-cols-4 px-4">
//             {stats.map((stat) => {
//               const StatIcon = stat.icon;
//               return (
//                 <div key={stat.label} className="text-center">
//                   <div className="flex justify-center mb-3">
//                     <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100/50">
//                       <StatIcon className="h-6 w-6 text-blue-600" />
//                     </div>
//                   </div>
//                   <p className="text-3xl md:text-4xl font-bold text-blue-600">
//                     {stat.value}
//                   </p>
//                   <p className="mt-2 text-sm text-muted-foreground font-medium">
//                     {stat.label}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* Services */}
//         <section className="container py-20 md:py-28 px-4">
//           <div className="mx-auto max-w-2xl text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
//               Services Tailored for You
//             </h2>
//             <p className="mt-4 text-lg text-muted-foreground">
//               Whether it's hands-on work at your location or expert help from
//               anywhere — Upward has you covered.
//             </p>
//           </div>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {services.map((s) => (
//               <Card
//                 key={s.title}
//                 className="group relative overflow-hidden border-border/40 hover:border-border/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white"
//               >
//                 <CardContent className="p-8">
//                   <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
//                     <s.icon className="h-7 w-7 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
//                   <p className="text-muted-foreground leading-relaxed">
//                     {s.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* How It Works */}
//         <section className="bg-slate-50/60 py-20 md:py-28">
//           <div className="container px-4">
//             <div className="mx-auto max-w-2xl text-center mb-16">
//               <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
//                 How It Works
//               </h2>
//               <p className="mt-4 text-lg text-muted-foreground">
//                 Three simple steps to getting expert help.
//               </p>
//             </div>
//             <div className="grid gap-8 sm:grid-cols-3">
//               {steps.map((step, idx) => (
//                 <div key={step.num} className="relative">
//                   {idx < steps.length - 1 && (
//                     <div className="hidden sm:block absolute top-12 -right-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
//                   )}
//                   <div className="relative rounded-2xl border border-border/40 bg-white p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
//                     <div className="flex justify-center mb-4">
//                       <span className="text-4xl">{step.icon}</span>
//                     </div>
//                     <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                       {step.num}
//                     </span>
//                     <h3 className="mt-4 text-lg font-bold text-foreground">
//                       {step.title}
//                     </h3>
//                     <p className="mt-2 text-sm text-muted-foreground">
//                       {step.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Why Upward */}
//         <section className="container py-20 md:py-28 px-4">
//           <div className="mx-auto max-w-2xl text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
//               Why Choose Upward
//             </h2>
//           </div>
//           <div className="grid gap-6 sm:grid-cols-3">
//             {features.map((item) => (
//               <div
//                 key={item.title}
//                 className="rounded-2xl border border-border/40 bg-white p-8 shadow-sm hover:shadow-lg hover:border-border/60 transition-all duration-300 group"
//               >
//                 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100/50 group-hover:bg-blue-100 transition-colors duration-300">
//                   <item.icon className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="mt-4 font-bold text-foreground text-lg">{item.title}</h3>
//                 <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Testimonials */}
//         <section className="bg-slate-50/60 py-20 md:py-28">
//           <div className="container px-4">
//             <div className="mx-auto max-w-2xl text-center mb-16">
//               <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
//                 Loved by Thousands
//               </h2>
//               <p className="mt-4 text-lg text-muted-foreground">
//                 See what our customers have to say.
//               </p>
//             </div>
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {testimonials.map((t) => (
//                 <Card
//                   key={t.name}
//                   className="border-border/40 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
//                 >
//                   <CardContent className="p-6">
//                     <div className="mb-4 flex gap-1">
//                       {Array.from({ length: t.rating }).map((_, i) => (
//                         <Star
//                           key={i}
//                           className="h-4 w-4 fill-amber-400 text-amber-400"
//                         />
//                       ))}
//                     </div>
//                     <p className="text-foreground leading-relaxed italic">
//                       "{t.text}"
//                     </p>
//                     <div className="mt-4 border-t border-border/20 pt-4">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
//                           <span className="text-sm font-bold text-white">{t.avatar}</span>
//                         </div>
//                         <div>
//                           <p className="font-bold text-foreground text-sm">{t.name}</p>
//                           <p className="text-xs text-muted-foreground">{t.role}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* CTA */}
//         <section className="relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600" />
//           <div className="absolute inset-0 overflow-hidden">
//             <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
//             <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
//           </div>
//           <div className="container relative z-10 flex flex-col items-center py-20 md:py-28 text-center px-4">
//             <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
//               Ready to Level Up?
//             </h2>
//             <p className="mt-4 max-w-lg text-white/80 text-lg">
//               Join thousands of satisfied customers. Get matched with a top
//               professional today.
//             </p>
//             <Button
//               size="lg"
//               className="mt-8 bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all text-base px-8"
//             >
//               Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default LandingPage;


import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Star, CheckCircle, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────
   Reveal hook
───────────────────────────────────────────── */
const useReveal = (delay = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition =
              "opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)";
            el.style.opacity = "1";
            el.style.transform = "none";
          }, delay);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
};

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
const Hero = () => {
  const badge   = useReveal(0);
  const heading = useReveal(100);
  const sub     = useReveal(220);
  const ctas    = useReveal(340);
  const stats   = useReveal(460);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#e8f2fa 1px, transparent 1px), linear-gradient(90deg, #e8f2fa 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.45,
        }}
      />
      {/* Radial fade on top of grid */}
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
        <p
          ref={sub}
          className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500"
        >
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

        {/* Social proof avatars */}
        <div ref={stats} className="mt-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["SK", "JR", "PM", "DC", "AT"].map((init, i) => (
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
            <span className="font-semibold text-gray-800">4.9 / 5</span> from
            2,000+ pros
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

/* ─────────────────────────────────────────────
   STATS BAR
───────────────────────────────────────────── */
const StatsBar = () => {
  const ref = useReveal(0);
  const items = [
    { value: "10K+", label: "Tasks Completed" },
    { value: "2K+",  label: "Verified Pros" },
    { value: "4.9★", label: "Avg Rating" },
    { value: "50+",  label: "Categories" },
  ];
  return (
    <div className="border-y border-gray-100 bg-gray-50">
      <div ref={ref} className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center justify-center gap-1 bg-gray-50 py-8 px-4 text-center">
            <span className="text-3xl font-extrabold tracking-tight text-[#719FC4]">
              {item.value}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
const services = [
  {
    title: "Onsite Services",
    desc: "Plumbing, electrical, cleaning, repairs — skilled pros come directly to you.",
    tags: ["Plumbing", "Electrical", "Cleaning", "Repairs"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: "Offsite Services",
    desc: "Design, development, consulting — expert work delivered remotely.",
    tags: ["Development", "Design", "Consulting", "Marketing"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    title: "Dedicated Teams",
    desc: "Hire full teams for large projects, managed end-to-end by Upward.",
    tags: ["Full-Stack", "Management", "Long-term"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const Services = () => {
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
          {services.map((s, i) => (
            <div
              key={s.title}
              ref={cardRefs[i]}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#719FC4]/30"
            >
              {/* Top accent line on hover */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-[#719FC4] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />

              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2F9] text-[#719FC4]">
                {s.icon}
              </div>

              <h3 className="mb-2.5 text-xl font-bold text-gray-900">{s.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-500">{s.desc}</p>

              <div className="mb-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"
                  >
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

/* ─────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────── */
const steps = [
  { num: "01", title: "Post your task", desc: "Tell us what you need in a few clicks. No calls, no paperwork — done in under 2 minutes." },
  { num: "02", title: "Get matched",    desc: "We instantly connect you with vetted, top-rated professionals who fit your needs." },
  { num: "03", title: "Get it done",    desc: "Work is completed on time. Pay only when you're 100% satisfied. Guaranteed." },
];

const HowItWorks = () => {
  const titleRef = useReveal(0);
  const stepRefs = [useReveal(0), useReveal(130), useReveal(260)];

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
          {steps.map((step, i) => (
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

        {/* Bottom CTA */}
        <div ref={useReveal(0)} className="mt-10 flex justify-center">
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

/* ─────────────────────────────────────────────
   WHY US
───────────────────────────────────────────── */
const features = [
  { icon: Shield,       title: "Vetted Professionals",   desc: "Every pro is background-checked and skill-verified before joining." },
  { icon: Zap,          title: "Matched in Minutes",      desc: "Our smart algorithm connects you with the right person fast." },
  { icon: CheckCircle,  title: "Satisfaction Guaranteed", desc: "Not happy? We'll fix it or refund you — no questions asked." },
  { icon: Users,        title: "Dedicated Support",       desc: "Real humans available 7 days a week. No bots, no queues." },
  { icon: Clock,        title: "Transparent Pricing",     desc: "See exact costs upfront. Zero hidden fees, ever." },
  { icon: Star,         title: "Top 5% Network",          desc: "We accept only the most skilled professionals in every category." },
];

const WhyUs = () => {
  const titleRef = useReveal(0);
  const featRefs = features.map((_, i) => useReveal(i * 60));

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
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={featRefs[i]}
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-7 transition-all duration-300 hover:bg-[#EAF2F9] hover:border-[#719FC4]/30"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-[#719FC4] group-hover:bg-[#719FC4] group-hover:text-white transition-all duration-300">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
const testimonials = [
  { name: "Sarah K.",  role: "Homeowner, New York",        text: "Upward sent a plumber within hours. The work was exceptional and the process completely seamless.", init: "SK", tag: "Onsite" },
  { name: "James R.",  role: "Startup Founder, London",    text: "Their remote dev team built our MVP in under 3 weeks. Perfect communication, ahead of schedule.", init: "JR", tag: "Offsite" },
  { name: "Priya M.",  role: "Property Manager, Chicago",  text: "I rely on Upward for all my maintenance needs across 12 properties. Not a single disappointment.", init: "PM", tag: "Onsite" },
  { name: "Daniel C.", role: "Restaurant Owner, Miami",    text: "The kitchen renovation team was outstanding. Professional, punctual, quality exceeded expectations.", init: "DC", tag: "Onsite" },
  { name: "Aisha T.",  role: "Marketing Director, Toronto", text: "We hired a design team for our rebrand. Six months in and still working with them. Incredible.", init: "AT", tag: "Dedicated" },
  { name: "Marco B.",  role: "Tech Lead, Berlin",          text: "Fastest way to find quality contractors. No fluff, just reliable professionals who deliver.", init: "MB", tag: "Offsite" },
];

const Testimonials = () => {
  const [active, setActive] = useState(0);
  const titleRef = useReveal(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="reviews" className="bg-gray-50 py-24 px-4 md:px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div ref={titleRef} className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#719FC4]">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Real results,<br />real people
            </h2>
          </div>
          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
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
          {testimonials.map((t, i) => (
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
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
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

              <p className="mb-5 text-sm leading-relaxed text-gray-500 italic">"{t.text}"</p>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    i === active ? "bg-[#719FC4] text-white" : "bg-[#EAF2F9] text-[#719FC4]"
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

/* ─────────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────────── */
const CTABanner = () => {
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
              {["No credit card", "Cancel anytime", "24/7 support"].map((it) => (
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

/* ─────────────────────────────────────────────
   LANDING PAGE ROOT
───────────────────────────────────────────── */
const LandingPage = () => (
  <main>
    <Hero />
    <StatsBar />
    <Services />
    <HowItWorks />
    <WhyUs />
    <Testimonials />
    <CTABanner />
  </main>
);

export default LandingPage;