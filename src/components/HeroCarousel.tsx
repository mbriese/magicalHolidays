"use client";

import Image from "next/image";
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
  backgroundImage?: string; // optional fallback if slides disabled
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

  // If slides are missing, you can still show a background image instead of returning null.
  const slide = slides?.length ? slides[currentSlide] : null;

  return (
    <section className="w-full">
      {/* 
        KEY FIX:
        Use 16:9 container so "object-contain" can be full-bleed with NO side gutters.
        Your images are 2560x1440 (16:9), so this is the cleanest lock.
      */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#0b1220]">
        {/* Background Image */}
        <Image
          src={slide?.image ?? backgroundImage}
          alt={slide?.imageAlt ?? "Hero background"}
          fill
          priority={currentSlide === 0}
          className="object-contain object-center"
          sizes="100vw"
        />

        {/* Readability gradient (left) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-10 lg:px-16">
          <div className="w-[620px] max-w-full ml-6">
              {/* Brand Line */}
              <div className="inline-flex items-center gap-3 mb-6">
                <Image
                  src="/images/brand/lantern-hero.png"
                  alt=""
                  aria-hidden="true"
                  width={96}
                  height={96}
                  className="w-14 md:w-16 lg:w-20 drop-shadow-[0_18px_40px_rgba(255,190,110,0.65)]"
                  priority
                />
                <span className="[font-family:var(--font-brand)] text-4xl md:text-5xl text-white drop-shadow-lg leading-none">
                  Magical Holidays
                </span>
              </div>

              {/* Slide Title */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg leading-tight">
                {slide?.title ?? "Plan Your Perfect Vacation"}
              </h1>

              {/* Slide Subtitle */}
              <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
                {slide?.subtitle ??
                  "Organize every detail of your magical adventure in one place."}
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

        {/* Optional: slide dots (safe even if you don’t use them yet) */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={slides[i].id}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 w-2 rounded-full transition ${
                  i === currentSlide ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
