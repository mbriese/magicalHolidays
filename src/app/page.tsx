export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section with Castle Background */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center hero-section">
        {/* Responsive Hero Background - Mobile */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
          style={{ backgroundImage: 'url(/images/hero-mobile.png)' }}
        />
        {/* Responsive Hero Background - Tablet */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block lg:hidden"
          style={{ backgroundImage: 'url(/images/hero-tablet.png)' }}
        />
        {/* Responsive Hero Background - Desktop */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden lg:block"
          style={{ backgroundImage: 'url(/images/hero-desktop.png)' }}
        />
        
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-[#1F2A44]/80 via-[#1F2A44]/40 to-transparent" />
        
        {/* Twinkling stars overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle top-[10%] left-[15%] opacity-80" style={{ animationDelay: '0s' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle top-[20%] left-[80%] opacity-70" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle top-[35%] left-[25%] opacity-60" style={{ animationDelay: '1s' }} />
          <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle top-[15%] left-[60%] opacity-80" style={{ animationDelay: '1.5s' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle top-[45%] left-[90%] opacity-70" style={{ animationDelay: '2s' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle top-[25%] left-[45%] opacity-60" style={{ animationDelay: '2.5s' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle top-[55%] left-[10%] opacity-50" style={{ animationDelay: '0.8s' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle top-[40%] left-[70%] opacity-70" style={{ animationDelay: '1.8s' }} />
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute top-20 left-10 text-4xl opacity-40 animate-float-slow">✨</div>
        <div className="absolute top-32 right-16 text-3xl opacity-30 animate-float-drift [animation-delay:1s]">⭐</div>
        <div className="absolute bottom-32 left-1/4 text-3xl opacity-30 animate-float-slow [animation-delay:0.5s]">🌟</div>
        <div className="absolute top-1/4 right-1/4 text-2xl opacity-25 animate-float-drift [animation-delay:2s]">✦</div>
        <div className="absolute bottom-1/4 right-10 text-3xl opacity-35 animate-float-slow [animation-delay:1.5s]">💫</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Plan Your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFB957] to-ember-300">
                Magical
              </span>{" "}
              Adventure
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow-md">
              Organize all your theme park reservations, dining, rides, hotels, and travel 
              in one enchanted place. Make every moment count.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/plan" className="btn-gold text-lg px-8 py-4">
                ✨ Start Planning ✨
              </a>
              <a href="/blog" className="btn-outline-light text-lg px-8 py-4">
                Latest Updates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-[#2a3654]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2A44] dark:text-[#FAF4EF] mb-4">
              Everything You Need for the Perfect Trip
            </h2>
            <p className="text-[#2B2B2B] dark:text-[#E5E5E5] max-w-2xl mx-auto">
              Keep all your reservations organized and accessible in one magical dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Park Reservations */}
            <div className="card-magical p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1F2A44]/10 dark:bg-[#1F2A44] flex items-center justify-center transition-transform hover:scale-110 hover:rotate-3">
                <span className="text-3xl">🏰</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-[#FAF4EF] mb-2">
                Park Reservations
              </h3>
              <p className="text-[#2B2B2B] dark:text-[#BDBDBD]">
                Track your theme park entry reservations and never miss a day of adventure.
              </p>
            </div>

            {/* Ride Scheduling */}
            <div className="card-magical p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFB957]/20 dark:bg-[#FFB957]/30 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-3">
                <span className="text-3xl">🎢</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-[#FAF4EF] mb-2">
                Ride Scheduling
              </h3>
              <p className="text-[#2B2B2B] dark:text-[#BDBDBD]">
                Plan your attraction times and Lightning Lane reservations with ease.
              </p>
            </div>

            {/* Hotel Bookings */}
            <div className="card-magical p-6 text-center animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F8AFA6]/30 dark:bg-[#F8AFA6]/20 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-3">
                <span className="text-3xl">🏨</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-[#FAF4EF] mb-2">
                Hotel Bookings
              </h3>
              <p className="text-[#2B2B2B] dark:text-[#BDBDBD]">
                Keep your resort reservations organized with check-in details at your fingertips.
              </p>
            </div>

            {/* Car Rentals */}
            <div className="card-magical p-6 text-center animate-slide-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#A7D2B7]/30 dark:bg-[#A7D2B7]/20 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-3">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-[#FAF4EF] mb-2">
                Car Rentals
              </h3>
              <p className="text-[#2B2B2B] dark:text-[#BDBDBD]">
                Manage your transportation with rental car pickup and return details.
              </p>
            </div>

            {/* Flight Info */}
            <div className="card-magical p-6 text-center animate-slide-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#677595]/20 dark:bg-[#677595]/30 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-3">
                <span className="text-3xl">✈️</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-[#FAF4EF] mb-2">
                Flight Information
              </h3>
              <p className="text-[#2B2B2B] dark:text-[#BDBDBD]">
                Store your flight details for easy access on travel days.
              </p>
            </div>

            {/* Group Trips */}
            <div className="card-magical p-6 text-center animate-slide-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F8AFA6]/30 dark:bg-[#F8AFA6]/20 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-3">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-[#FAF4EF] mb-2">
                Group Trips
              </h3>
              <p className="text-[#2B2B2B] dark:text-[#BDBDBD]">
                Plan together! Invite family and friends to collaborate on your trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Preview Section */}
      <section className="py-20 bg-linear-to-b from-[#FAF4EF] to-white dark:from-[#1F2A44] dark:to-[#2a3654]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2A44] dark:text-[#FAF4EF] mb-6">
                Your Trip at a Glance
              </h2>
              <p className="text-[#2B2B2B] dark:text-[#E5E5E5] mb-6">
                See your entire vacation laid out on an intuitive calendar. 
                Switch between month, week, and day views to plan every detail.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-[#1F2A44]"></span>
                  <span className="text-[#2B2B2B] dark:text-[#E5E5E5]">Park Reservations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-[#FFB957]"></span>
                  <span className="text-[#2B2B2B] dark:text-[#E5E5E5]">Ride Times</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-[#F8AFA6]"></span>
                  <span className="text-[#2B2B2B] dark:text-[#E5E5E5]">Hotel Stays</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-[#A7D2B7]"></span>
                  <span className="text-[#2B2B2B] dark:text-[#E5E5E5]">Car Rentals</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-[#677595]"></span>
                  <span className="text-[#2B2B2B] dark:text-[#E5E5E5]">Flights</span>
                </li>
              </ul>
            </div>
            
            {/* Calendar Preview Placeholder */}
            <div className="card-magical p-6 bg-white dark:bg-[#2a3654]">
              <div className="bg-[#FAF4EF] dark:bg-[#1F2A44] rounded-lg p-8 text-center">
                <span className="text-6xl mb-4 block">📅</span>
                <p className="text-[#2B2B2B] dark:text-[#FAF4EF] font-medium">
                  Interactive Calendar View
                </p>
                <p className="text-sm text-[#BDBDBD] mt-2">
                  Sign up to see your personalized trip calendar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-animated-gradient overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-2 h-2 bg-[#FFB957] rounded-full animate-float-drift opacity-30 top-[20%] left-[10%]" style={{ animationDelay: '0s' }} />
          <div className="absolute w-3 h-3 bg-[#FFB957] rounded-full animate-float-slow opacity-20 top-[60%] right-[15%]" style={{ animationDelay: '1s' }} />
          <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle opacity-40 top-[30%] right-[30%]" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle opacity-30 bottom-[25%] left-[25%]" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#FAF4EF] mb-6">
            Ready to Make Magical Memories?
          </h2>
          <p className="text-[#E5E5E5] text-lg mb-8">
            Join Magical Holidays today and start planning your perfect vacation.
          </p>
          <a href="/register" className="btn-gold text-lg px-10 py-4 inline-block animate-pulse-glow">
            ✨ Create Your Free Account ✨
          </a>
        </div>
      </section>
    </div>
  );
}

