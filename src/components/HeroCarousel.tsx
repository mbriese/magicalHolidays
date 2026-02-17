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
}

export default function HeroCarousel({
  slides,
  autoPlayInterval = 6000,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval, slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full h-[90vh] min-h-[650px] max-h-[1000px] overflow-hidden">

      {/* Slides */}
      {slides.map((slide, index) => (
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
            className="object-cover object-[center_55%]"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

          {/* ================= BRAND LOCKUP ================= */}
          <div className="absolute left-[8%] top-[6%] flex items-center gap-4 z-20">

          <Image
          src="/images/heroes/lanternLogo.png"
  alt="Lamplight Holidays"
  width={160}
  height={160}
  priority
  className="
    w-18 md:w-22 lg:w-28 h-auto
    drop-shadow-[0_25px_60px_rgba(255,190,110,0.65)]
    pointer-events-none select-none
  "
/>


            <span
              className="
                [font-family:var(--font-brand)]
                text-4xl md:text-5xl lg:text-6xl
                leading-none
                text-white
                drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]
                whitespace-nowrap
              "
            >
              Lamplight Holidays
            </span>
          </div>

          {/* ================= TEXT BLOCK ================= */}
          <div className="absolute top-[24%] left-[8%] ml-16 md:ml-20 lg:ml-24 max-w-xl text-white z-20">


            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
              {slide.title}
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow">
              {slide.subtitle}
            </p>

          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full p-3 text-white"
          >
            ‹
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full p-3 text-white"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
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
  );
}
