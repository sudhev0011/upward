import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// ReactBits Components
import ShinyText from "@/components/reactbits/ShinyText";
import BlurText from "@/components/reactbits/BlurText";
import Magnet from "@/components/reactbits/Magnet";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import SoftAurora from "@/components/reactbits/SoftAurora";
import GradientText from "@/components/reactbits/GradientText";

const AVATARS = ["SK", "JR", "PM", "DC", "AT"];

export const Hero = () => {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center py-20"
    >
      {/* 1. Dynamic Particle Background */}
      <div className="absolute inset-0 z-0">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1}
          color1="#719FC4"
          color2="#FF6363"
          noiseFrequency={2.5}
          noiseAmplitude={1}
          bandHeight={0.6}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1}
          enableMouseInteraction={false}
          mouseInfluence={0.25}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        {/* 2. Shimmering Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#719FC4]/20 bg-[#EAF2F9]/50 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#719FC4] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#719FC4]"></span>
            </span>
            <ShinyText
              text="Trusted by 10,000+ customers"
              disabled={false}
              speed={5}
              shineColor="black"
              className="text-xs font-bold uppercase tracking-widest text-[#5585A8]"
            />
          </div>
        </div>

        <div className="mb-6 max-w-5xl">
          <GradientText
            colors={["#719FC4", "#FF6363", "#719FC4"]}
            animationSpeed={8}
            showBorder={false}
            className="text-[clamp(40px,8vw,90px)]"
          >
            Get any job done with{" "}
          </GradientText>
          <h1 className="text-[clamp(40px,8vw,90px)] font-black leading-[0.9] tracking-tighter text-gray-900">
            Upward
          </h1>
        </div>

        {/* 4. Smooth Text Reveal */}
        <div className="mx-auto max-w-xl mb-12">
          <BlurText
            text="Your all-in-one platform for onsite & offsite services. Connect with vetted professionals and get things done — fast, reliably, and on your terms."
            delay={100}
            animateBy="words"
            direction="bottom"
            className="text-lg md:text-xl text-gray-500 font-medium"
          />
        </div>

        {/* 5. Magnetized Actions */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-20">
          <Magnet padding={30} magnetStrength={5}>
            <Link to="/register">
              <Button
                size="lg"
                className="group h-16 gap-3 bg-[#719FC4] px-12 text-xl font-bold text-white shadow-2xl shadow-[#719FC4]/30 transition-all hover:bg-[#5585A8] rounded-2xl overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free{" "}
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
          </Magnet>

          <Magnet padding={30} magnetStrength={5}>
            <Link to="/providers">
              <Button
                size="lg"
                variant="outline"
                className="h-16 border-2 border-gray-200 bg-transparent px-12 text-xl font-bold text-gray-700 hover:border-[#719FC4] hover:text-[#719FC4] rounded-2xl transition-colors"
              >
                Browse Services
              </Button>
            </Link>
          </Magnet>
        </div>

        {/* 6. Spotlight Social Proof */}
        <div className="w-full max-w-md">
          <SpotlightCard
            className="p-6 rounded-3xl border border-gray-100 bg-white/40 backdrop-blur-xl"
            spotlightColor="rgba(113, 159, 196, 0.15)"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex -space-x-4">
                {AVATARS.map((init, i) => (
                  <div
                    key={init}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-tr from-[#719FC4] to-[#A0C4E1] text-[13px] font-black text-white shadow-lg transition-transform hover:-translate-y-2"
                    style={{ zIndex: 5 - i }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400 animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <p className="text-gray-600 font-medium">
                  <span className="text-gray-900 font-bold">4.9 / 5</span> from
                  2,000+ vetted pros
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
