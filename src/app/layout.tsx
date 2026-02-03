import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Magical Holidays - Your Enchanted Travel Planner",
  description: "Plan your magical theme park vacation with ease. Organize park reservations, rides, hotels, car rentals, and flights all in one place.",
  keywords: ["travel planner", "vacation", "theme park", "trip planning", "reservations"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
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
  themeColor: "#1F2A44",
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
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#FAF4EF] dark:bg-[#1F2A44]">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white/90 dark:bg-[#1F2A44]/90 backdrop-blur-md border-b border-[#E5E5E5] dark:border-midnight-500 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <a href="/" className="flex items-center space-x-2">
                  <span className="text-2xl">✨</span>
                  <span className="font-serif text-xl font-semibold text-[#1F2A44] dark:text-[#FAF4EF]">
                    Magical Holidays
                  </span>
                </a>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <a
                    href="/dashboard"
                    className="text-[#2B2B2B] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/trips"
                    className="text-[#2B2B2B] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors font-medium"
                  >
                    My Trips
                  </a>
                  <a
                    href="/blog"
                    className="text-[#2B2B2B] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors font-medium"
                  >
                    News & Updates
                  </a>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-3">
                  <a
                    href="/login"
                    className="text-[#1F2A44] dark:text-[#FFB957] hover:text-[#FFB957] dark:hover:text-ember-300 font-medium transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="btn-gold text-sm py-2 px-4"
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
          <footer className="bg-[#1F2A44] text-[#FAF4EF] py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">✨</span>
                    <span className="font-serif text-xl font-semibold text-[#FFB957]">
                      Magical Holidays
                    </span>
                  </div>
                  <p className="text-sm text-[#BDBDBD]">
                    Your enchanted travel companion for planning unforgettable theme park adventures.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="font-semibold text-[#FFB957] mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/dashboard" className="hover:text-[#FFB957] transition-colors">
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a href="/trips" className="hover:text-[#FFB957] transition-colors">
                        My Trips
                      </a>
                    </li>
                    <li>
                      <a href="/blog" className="hover:text-[#FFB957] transition-colors">
                        News & Updates
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Disclaimer */}
                <div>
                  <h3 className="font-semibold text-[#FFB957] mb-4">Disclaimer</h3>
                  <p className="text-sm text-[#BDBDBD]">
                    Magical Holidays is an independent travel planning tool. 
                    We are not affiliated with, endorsed by, or connected to any theme park or entertainment company.
                  </p>
                </div>
              </div>

              <div className="border-t border-midnight-500 mt-8 pt-8 text-center text-sm text-[#BDBDBD]">
                <p>© 2026 Magical Holidays. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

