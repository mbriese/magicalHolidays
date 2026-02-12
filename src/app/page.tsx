import HeroCarousel from "@/components/HeroCarousel";
import { heroSlides } from "@/data/heroSlides";

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Carousel Section */}
      <HeroCarousel 
        slides={heroSlides}
        backgroundImage="/images/heroes/hero-milestones.jpg"
        autoPlayInterval={6000}
      />

      {/* Quick Start Section */}
      <section className="pt-8 pb-4 bg-white dark:bg-[#2a3654]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
              What are you planning?
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Hotels */}
            <a 
              href="/plan?type=HOTEL" 
              className="card-trip p-3 text-center group cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-[#F8AFA6]/30 dark:bg-[#F8AFA6]/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
                Hotels
              </h3>
            </a>

            {/* Transportation */}
            <a 
              href="/plan?type=FLIGHT" 
              className="card-trip p-3 text-center group cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-[#A7D2B7]/30 dark:bg-[#A7D2B7]/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-2xl">✈️🚗</span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
                Transportation
              </h3>
            </a>

            {/* Attractions */}
            <a 
              href="/plan?type=PARK" 
              className="card-trip p-3 text-center group cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-[#1F2A44]/10 dark:bg-[#1F2A44] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-2xl">🏰🎢</span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
                Attractions
              </h3>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-10 bg-animated-gradient overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-2 h-2 bg-[#FFB957] rounded-full animate-float-drift opacity-30 top-[20%] left-[10%]" style={{ animationDelay: '0s' }} />
          <div className="absolute w-3 h-3 bg-[#FFB957] rounded-full animate-float-slow opacity-20 top-[60%] right-[15%]" style={{ animationDelay: '1s' }} />
          <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle opacity-40 top-[30%] right-[30%]" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle opacity-30 bottom-[25%] left-[25%]" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#FAF4EF] mb-3">
            Ready to Make Magical Memories?
          </h2>
          <p className="text-[#E5E5E5] mb-4">
            Join Magical Holidays today and start planning your perfect vacation.
          </p>
          <a href="/register" className="btn-gold px-8 py-3 inline-block animate-pulse-glow">
            ✨ Create Your Free Account ✨
          </a>
        </div>
      </section>
    </div>
  );
}

