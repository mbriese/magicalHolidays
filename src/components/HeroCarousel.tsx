"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  objectPosition?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number; // ms
}

export default function HeroCarousel({
  slides,
  autoPlayInterval = 6000,
}: HeroCarouselProps) {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const safeSlides = useMemo(
    () => (Array.isArray(slides) ? slides : []),
    [slides],
  );
  const hasSlides = safeSlides.length > 0;

  const goToSlide = useCallback(
    (index: number) => {
      if (!hasSlides) return;
      if (isTransitioning) return;

      const clamped =
        ((index % safeSlides.length) + safeSlides.length) % safeSlides.length;
      setIsTransitioning(true);
      setCurrentSlide(clamped);

      window.setTimeout(() => setIsTransitioning(false), 650);
    },
    [hasSlides, isTransitioning, safeSlides.length],
  );

  const nextSlide = useCallback(() => {
    if (!hasSlides) return;
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide, hasSlides]);

  const prevSlide = useCallback(() => {
    if (!hasSlides) return;
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide, hasSlides]);

  // Auto-play
  useEffect(() => {
    if (!hasSlides) return;
    if (safeSlides.length <= 1) return;

    const interval = window.setInterval(nextSlide, autoPlayInterval);
    return () => window.clearInterval(interval);
  }, [autoPlayInterval, nextSlide, hasSlides, safeSlides.length]);

  // Keep currentSlide valid if slides array changes
  useEffect(() => {
    if (!hasSlides) return;
    setCurrentSlide((prev) => Math.min(prev, safeSlides.length - 1));
  }, [hasSlides, safeSlides.length]);

  if (!hasSlides) return null;

  return (
    <section className="w-full">
      <div className="relative w-screen h-[65vh] sm:h-[70vh] md:h-[85vh] min-h-[420px] sm:min-h-[450px] md:min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Slides */}
        {safeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition: slide.objectPosition ?? "center 55%",
              }}
            />

            {/* Left readability gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-black/45 via-black/20 to-transparent" />

            {/* ================= BRAND LOCKUP ================= */}
            <div className="absolute left-4 sm:left-[8%] top-[4%] sm:top-[5%] flex items-center gap-2 sm:gap-4 z-20 pointer-events-none select-none max-w-[85%]">
              <Image
                src="/images/heroes/lanternLogo.png"
                alt="Lamplight Holidays"
                width={160}
                height={160}
                priority
                className="w-10 sm:w-14 md:w-16 lg:w-20 h-auto shrink-0 drop-shadow-[0_25px_60px_rgba(255,190,110,0.65)]"
              />
              <span
                className="
                  [font-family:var(--font-brand)]
                  text-2xl sm:text-4xl md:text-5xl lg:text-6xl
                  leading-none
                  text-white
                  drop-shadow-[0_10px_35px_rgba(0,0,0,0.65)]
                "
              >
                Lamplight Holidays
              </span>
            </div>

            {/* ================= TEXT BLOCK ================= */}
            <div className="absolute top-[20%] sm:top-[24%] left-4 sm:left-[8%] right-4 sm:right-auto max-w-xl text-white z-20">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="mt-2 sm:mt-4 text-sm sm:text-lg md:text-xl text-white/90 drop-shadow">
                {slide.subtitle}
              </p>

              {/* ================= CTA BUTTONS ================= */}
              <div className="mt-4 sm:mt-8 flex flex-col items-start gap-2 sm:flex-row sm:gap-3 sm:items-center">
                <Link
                  href="/plan"
                  className="
                    whitespace-nowrap
                    group inline-flex items-center justify-center
                    rounded-xl px-4 py-2 sm:px-6 sm:py-3
                    text-xs sm:text-sm md:text-base font-semibold
                    bg-[#FFB957] text-[#1F2A44]
                    shadow-[0_16px_40px_rgba(255,185,87,0.35)]
                    hover:brightness-105 hover:shadow-[0_18px_55px_rgba(255,185,87,0.55)]
                    hover:-translate-y-px
                    active:translate-y-0 active:scale-[0.99]
                    transition
                  "
                >
                  Start Planning →
                </Link>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="
                    whitespace-nowrap
                    group inline-flex items-center justify-center
                    rounded-xl px-4 py-2 sm:px-6 sm:py-3
                    text-xs sm:text-sm md:text-base font-semibold
                    bg-white/15 backdrop-blur
                    border border-white/35
                    text-white
                    hover:bg-white/22 hover:-translate-y-px
                    active:translate-y-0 active:scale-[0.99]
                    transition
                  "
                >
                  View My Trips
                </button>

                <a
                  href="https://disneyland.disney.go.com/calendars/five-day/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    whitespace-nowrap
                    group inline-flex items-center justify-center
                    rounded-xl px-4 py-2 sm:px-6 sm:py-3
                    text-xs sm:text-sm md:text-base font-semibold
                    bg-[#FFD27A]/15 backdrop-blur
                    border border-[#FFD27A]/35
                    text-white
                    hover:bg-[#FFD27A]/22 hover:-translate-y-px
                    active:scale-[0.99]
                    transition
                  "
                >
                  View Park Calendar 📅
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows — hidden on small screens to avoid overlapping CTAs */}
        {safeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full p-3 text-white"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full p-3 text-white"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {safeSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {safeSlides.map((s, index) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
