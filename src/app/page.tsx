export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-100 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/20" />
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">✨</div>
        <div className="absolute top-40 right-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute bottom-20 left-1/4 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🌟</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-purple-900 dark:text-white mb-6">
              Plan Your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-amber-500">
                Magical
              </span>{" "}
              Adventure
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
              Organize all your theme park reservations, dining, rides, hotels, and travel 
              in one enchanted place. Make every moment count.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn-magical text-lg px-8 py-4">
                Start Planning ✨
              </a>
              <a href="/blog" className="btn-outline text-lg px-8 py-4">
                Latest Updates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-4">
              Everything You Need for the Perfect Trip
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Keep all your reservations organized and accessible in one magical dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Park Reservations */}
            <div className="card-magical p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-3xl">🏰</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-2">
                Park Reservations
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Track your theme park entry reservations and never miss a day of adventure.
              </p>
            </div>

            {/* Ride Scheduling */}
            <div className="card-magical p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-3xl">🎢</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-2">
                Ride Scheduling
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Plan your attraction times and Lightning Lane reservations with ease.
              </p>
            </div>

            {/* Hotel Bookings */}
            <div className="card-magical p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-3xl">🏨</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-2">
                Hotel Bookings
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Keep your resort reservations organized with check-in details at your fingertips.
              </p>
            </div>

            {/* Car Rentals */}
            <div className="card-magical p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-2">
                Car Rentals
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your transportation with rental car pickup and return details.
              </p>
            </div>

            {/* Flight Info */}
            <div className="card-magical p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <span className="text-3xl">✈️</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-2">
                Flight Information
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Store your flight details for easy access on travel days.
              </p>
            </div>

            {/* Group Trips */}
            <div className="card-magical p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-2">
                Group Trips
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Plan together! Invite family and friends to collaborate on your trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Preview Section */}
      <section className="py-20 bg-linear-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-6">
                Your Trip at a Glance
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                See your entire vacation laid out on an intuitive calendar. 
                Switch between month, week, and day views to plan every detail.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-reservation-park"></span>
                  <span className="text-slate-700 dark:text-slate-300">Park Reservations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-reservation-ride"></span>
                  <span className="text-slate-700 dark:text-slate-300">Ride Times</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-reservation-hotel"></span>
                  <span className="text-slate-700 dark:text-slate-300">Hotel Stays</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-reservation-car"></span>
                  <span className="text-slate-700 dark:text-slate-300">Car Rentals</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-reservation-flight"></span>
                  <span className="text-slate-700 dark:text-slate-300">Flights</span>
                </li>
              </ul>
            </div>
            
            {/* Calendar Preview Placeholder */}
            <div className="card-magical p-6 bg-white dark:bg-slate-800">
              <div className="bg-purple-50 dark:bg-slate-700 rounded-lg p-8 text-center">
                <span className="text-6xl mb-4 block">📅</span>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  Interactive Calendar View
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Sign up to see your personalized trip calendar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make Magical Memories?
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            Join Magical Holidays today and start planning your perfect vacation.
          </p>
          <a href="/register" className="btn-gold text-lg px-10 py-4 inline-block">
            Create Your Free Account ✨
          </a>
        </div>
      </section>
    </div>
  );
}
