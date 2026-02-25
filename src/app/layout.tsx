import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Italianno } from "next/font/google";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";
import PixieDust from "@/components/PixieDust";

const brand = Italianno({
  subsets: ["latin"],
  weight: ["400"], // Italianno only has 400
  variable: "--font-brand",
  display: "swap",
});


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
  title: "Lamplight Holidays - Your Enchanted Travel Planner",
  description: "Where magical trips become effortless. Organize reservations, experiences, and travel details in one beautifully simple place.",
  keywords: ["travel planner", "vacation", "theme park", "trip planning", "reservations"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lamplight Holidays",
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
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${brand.variable}`}>
      <body className="min-h-screen bg-[#FAF4EF] dark:bg-[#1F2A44]">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white/90 dark:bg-[#1F2A44]/90 backdrop-blur-md border-b border-[#E5E5E5] dark:border-midnight-500 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-3 sm:py-4">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
                  <img src="/images/brand/lantern.svg" alt="Lamplight Holidays lantern logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"/>
                  <span className="[font-family:var(--font-brand)] text-xl sm:text-2xl md:text-4xl leading-none text-[#1F2A44] dark:text-[#FAF4EF] truncate">
                    Lamplight Holidays
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

                {/* Auth Buttons + PixieDust */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <PixieDust />
                  <a
                    href="/login"
                    className="text-[#1F2A44] dark:text-[#FFB957] hover:text-[#FFB957] dark:hover:text-ember-300 font-medium transition-colors whitespace-nowrap"
                    title="Sign In"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:hidden"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span className="hidden sm:inline text-sm sm:text-base">Sign In</span>
                  </a>
                  <a
                    href="/register"
                    className="btn-gold text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4 whitespace-nowrap"
                    title="Get Started"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:hidden"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                    <span className="hidden sm:inline">Get Started</span>
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
<footer className="bg-[#1F2A44] text-[#FAF4EF] py-8 mt-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-[#FFB957] font-semibold">© 2026 Lamplight Holidays</span>
        <span className="opacity-70">All rights reserved.</span>
      </div>

      <p className="leading-snug text-[#BDBDBD]/90">
        Lamplight Holidays is an independent travel planning tool. Not affiliated with any theme park or entertainment company.
      </p>
    </div>
  </div>
</footer>
        </div>
      </body>
    </html>
  );
}

