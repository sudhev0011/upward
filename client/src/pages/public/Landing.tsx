import { Hero } from "@/components/common/landing/Hero";
import { StatsBar }     from "@/components/common/landing/StatsBar";
import { Services }     from "@/components/common/landing/Services";
import { HowItWorks }   from "@/components/common/landing/HowItWorks";
import { WhyUs }        from "@/components/common/landing/WhyUs";
import { Testimonials } from "@/components/common/landing/Testimonials";
import { CTABanner }    from "@/components/common/landing/CTABanner";

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