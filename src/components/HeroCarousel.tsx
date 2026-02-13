"use client";

import { useEffect, useCallback, useState } from "react";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  backgroundImage?: string; // using this while carousel content is disabled
}

export default function HeroCarousel({
  slides,
  autoPlayInterval = 5000,
  backgroundImage = "/images/heroes/hero-milestones.jpg",
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    if (!slides.length) return;
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, slides.length]);

  return (
    <section className="w-full">
      <div
        className="
          relative w-full overflow-hidden
          h-[62vh] min-h-[520px] max-h-[760px]
        "
        aria-label="Hero"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {/* Readability gradient (subtle) */}
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/15 to-transparent" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-6 lg:px-10">
            <div className="max-w-[640px]">
            {/* Brand line (lamp + script) */}
<div className="inline-flex items-center gap-3">
  <img
    src="/images/brand/lantern-hero.png"
    alt=""
    aria-hidden="true"
    className="
      w-16 md:w-20 lg:w-24
      translate-y-2
      drop-shadow-[0_18px_40px_rgba(255,190,110,0.65)]
      opacity-100
      pointer-events-none select-none
    "
  />

  <div
    className="
      [font-family:var(--font-brand)]
      text-white/95
      text-3xl md:text-4xl
      leading-none
      drop-shadow-sm
    "
  >
    Magical Holidays
  </div>
</div>


              {/* Headline */}
              <h1 className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg leading-tight">
                Memorable Milestones
              </h1>

              {/* Tagline */}
              <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
                Where milestones become memories
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/plan"
                  className="px-6 py-3 rounded-full bg-[#FFB957] text-[#1F2A44] font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                  Start Planning
                </a>

                <a
                  href="/calendar"
                  className="px-6 py-3 rounded-full border border-white/70 text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition"
                >
                  View Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
