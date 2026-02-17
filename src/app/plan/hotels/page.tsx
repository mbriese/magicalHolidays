"use client";

import { useMemo, useState } from "react";

type BudgetRange = "any" | "0-150" | "150-300" | "300-500" | "500+";

export default function HotelsPlanPage() {
  const [city, setCity] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [guests, setGuests] = useState<number>(2);
  const [budget, setBudget] = useState<BudgetRange>("any");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const canSubmit = useMemo(() => {
    return city.trim().length > 0 && checkIn && checkOut && guests > 0;
  }, [city, checkIn, checkOut, guests]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { city, hotelName, guests, budget, checkIn, checkOut };
    console.log("HOTEL SEARCH:", payload);
    // TODO: call your search endpoint + show results
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-[#2a3654]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a
          href="/"
          className="text-sm text-[#1F2A44] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors"
        >
          ← Back home
        </a>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
          Hotel Search
        </h1>
        <p className="mt-2 text-[#2B2B2B] dark:text-[#E5E5E5]">
          Find a stay that fits your dates, guests, and budget.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border border-[#E5E5E5] dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-5 md:p-6 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Anaheim, CA"
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            {/* Hotel Name (optional) */}
            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
                Hotel name (optional)
              </label>
              <input
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="Grand Californian"
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
                Guests
              </label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
                Budget (per night)
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as BudgetRange)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              >
                <option value="any">Any</option>
                <option value="0-150">$0–$150</option>
                <option value="150-300">$150–$300</option>
                <option value="300-500">$300–$500</option>
                <option value="500+">$500+</option>
              </select>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-6 py-3 rounded-full font-semibold shadow-lg transition
                ${
                  canSubmit
                    ? "bg-[#FFB957] text-[#1F2A44] hover:scale-[1.02]"
                    : "bg-[#E5E5E5] text-[#777] cursor-not-allowed"
                }`}
            >
              Search Hotels
            </button>

            <span className="text-sm text-[#2B2B2B]/70 dark:text-[#E5E5E5]/70">
              Results can render below this form in v1.
            </span>
          </div>
        </form>

        {/* Results placeholder */}
        <div className="mt-6 rounded-2xl border border-dashed border-[#E5E5E5] dark:border-white/10 p-6 text-[#2B2B2B] dark:text-[#E5E5E5]">
          <div className="font-semibold">Results</div>
          <div className="text-sm opacity-80">
            Coming next: show hotel cards, filters, and save-to-itinerary actions.
          </div>
        </div>
      </div>
    </div>
  );
}
