import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";

export const metadata: Metadata = {
  title: "Magical Holidays - Your Enchanted Travel Planner",
  description: "Plan your magical theme park vacation with ease. Organize park reservations, rides, hotels, car rentals, and flights all in one place.",
  keywords: ["travel planner", "vacation", "theme park", "trip planning", "reservations"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Magical Holidays",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-linear-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-purple-100 dark:border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <a href="/" className="flex items-center space-x-2">
                  <span className="text-2xl">✨</span>
                  <span className="font-serif text-xl font-bold text-purple-900 dark:text-purple-100">
                    Magical Holidays
                  </span>
                </a>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <a
                    href="/dashboard"
                    className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/trips"
                    className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                  >
                    My Trips
                  </a>
                  <a
                    href="/blog"
                    className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                  >
                    News & Updates
                  </a>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-3">
                  <a
                    href="/login"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="btn-magical text-sm py-2 px-4"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="grow">
            <PWAProvider>
              {children}
            </PWAProvider>
          </main>

          {/* Footer */}
          <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">✨</span>
                    <span className="font-serif text-xl font-bold text-white">
                      Magical Holidays
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Your enchanted travel companion for planning unforgettable theme park adventures.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/dashboard" className="hover:text-purple-400 transition-colors">
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a href="/trips" className="hover:text-purple-400 transition-colors">
                        My Trips
                      </a>
                    </li>
                    <li>
                      <a href="/blog" className="hover:text-purple-400 transition-colors">
                        News & Updates
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Disclaimer */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Disclaimer</h3>
                  <p className="text-sm text-slate-400">
                    Magical Holidays is an independent travel planning tool. 
                    We are not affiliated with, endorsed by, or connected to any theme park or entertainment company.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
                <p>© 2026 Magical Holidays. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
