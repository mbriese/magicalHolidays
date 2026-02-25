import HeroCarousel from "@/components/HeroCarousel";
import { heroSlides } from "@/data/heroSlides";

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Carousel Section */}
      <HeroCarousel slides={heroSlides} autoPlayInterval={6000} />

      {/* Quick Start Section */}
      <section className="pt-5 sm:pt-8 pb-4 bg-white dark:bg-[#2a3654]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-2">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
              What are you planning?
            </h2>
          </div>

          <div className="grid grid-cols-4 max-w-2xl gap-2 sm:gap-4">
            <a
              href="/plan/hotels"
              className="card-trip p-2 sm:p-3 text-center group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-1 sm:mb-2 rounded-full bg-[#F8AFA6]/30 dark:bg-[#F8AFA6]/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg sm:text-2xl">🏨</span>
              </div>
              <h3 className="font-serif text-xs sm:text-base font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
                Hotels
              </h3>
            </a>

            <a
              href="/plan/flights"
              className="card-trip p-2 sm:p-3 text-center group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-1 sm:mb-2 rounded-full bg-[#A7D2B7]/30 dark:bg-[#A7D2B7]/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg sm:text-2xl">✈️</span>
              </div>
              <h3 className="font-serif text-xs sm:text-base font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
                Flights
              </h3>
            </a>

            <a
              href="/plan/cars"
              className="card-trip p-2 sm:p-3 text-center group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-1 sm:mb-2 rounded-full bg-[#FFB957]/25 dark:bg-[#FFB957]/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg sm:text-2xl">🚗</span>
              </div>
              <h3 className="font-serif text-xs sm:text-base font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
                Cars
              </h3>
            </a>

            <a
              href="/plan/parks"
              className="card-trip p-2 sm:p-3 text-center group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-1 sm:mb-2 rounded-full bg-[#1F2A44]/10 dark:bg-[#1F2A44] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg sm:text-2xl">🏰🎢</span>
              </div>
              <h3 className="font-serif text-xs sm:text-base font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
                <span className="sm:hidden">Parks</span>
                <span className="hidden sm:inline">Attractions</span>
              </h3>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
