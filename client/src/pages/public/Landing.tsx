import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Wrench,
  Monitor,
  Users,
  Star,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Onsite Services",
    description:
      "Plumbing, electrical, cleaning, repairs — skilled pros come to you.",
  },
  {
    icon: Monitor,
    title: "Offsite Services",
    description:
      "Design, development, consulting — expert work delivered remotely.",
  },
  {
    icon: Users,
    title: "Dedicated Teams",
    description:
      "Hire full teams for large projects, managed end-to-end by Upward.",
  },
];

const steps = [
  {
    num: "01",
    title: "Tell Us What You Need",
    description: "Describe your project or task in a few clicks.",
  },
  {
    num: "02",
    title: "Get Matched",
    description: "We connect you with vetted, top-rated professionals.",
  },
  {
    num: "03",
    title: "Get It Done",
    description: "Work gets completed on time, every time. Guaranteed.",
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Homeowner",
    text: "Upward sent a plumber within hours. Incredible speed and quality!",
    rating: 5,
  },
  {
    name: "James R.",
    role: "Startup Founder",
    text: "Their remote dev team built our MVP in 3 weeks. Total game-changer.",
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Property Manager",
    text: "I use Upward for all my maintenance needs. Reliable every single time.",
    rating: 5,
  },
];

const stats = [
  { value: "10K+", label: "Tasks Completed" },
  { value: "2K+", label: "Verified Pros" },
  { value: "4.9", label: "Average Rating" },
  { value: "50+", label: "Service Categories" },
];

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute top-20 -left-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-10 -right-32 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="container relative z-10 flex flex-col items-center py-24 md:py-36 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" /> Now serving 50+ categories
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Get Things Done with{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Upward
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Your all-in-one platform for onsite &amp; offsite services. From home
              repairs to remote development — we match you with top professionals,
              fast.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transition-all text-base px-8"
              >
                Get Started <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-base px-8"
              >
                Browse Services
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border/60 bg-muted/40">
          <div className="container grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="container py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Services Tailored for You
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether it's hands-on work at your location or expert help from
              anywhere — Upward has you covered.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Card
                key={s.title}
                className="group relative overflow-hidden border-border/60 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
                    <s.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/40 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-14">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-muted-foreground">
                Three simple steps to getting expert help.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="relative rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm"
                >
                  <span className="text-5xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    {step.num}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Upward */}
        <section className="container py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Why Choose Upward
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Shield, title: "Vetted Professionals", desc: "Every pro is background-checked and skill-verified." },
              { icon: Clock, title: "Fast Turnaround", desc: "Get matched within minutes, work started within hours." },
              { icon: CheckCircle2, title: "Satisfaction Guaranteed", desc: "Not happy? We'll make it right or refund you." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/40 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-14">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Loved by Thousands
              </h2>
              <p className="mt-4 text-muted-foreground">
                See what our customers have to say.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <Card
                  key={t.name}
                  className="border-border/60 shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed">
                      "{t.text}"
                    </p>
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="font-bold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-primary to-accent" />
          <div className="container relative z-10 flex flex-col items-center py-20 md:py-28 text-center">
            <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
              Ready to Level Up?
            </h2>
            <p className="mt-4 max-w-lg text-primary-foreground/80">
              Join thousands of satisfied customers. Get matched with a top
              professional today.
            </p>
            <Button
              size="lg"
              className="mt-8 bg-background text-foreground font-semibold shadow-lg hover:bg-background/90 transition-all text-base px-8"
            >
              Get Started Free <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
