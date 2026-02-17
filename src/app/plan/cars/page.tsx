"use client";

import { useMemo, useState } from "react";

type CarType = "any" | "compact" | "midsize" | "suv" | "minivan" | "luxury";

export default function CarsPlanPage() {
  const [city, setCity] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [carType, setCarType] = useState<CarType>("any");
  const [budgetMax, setBudgetMax] = useState<number>(150);

  const canSubmit = useMemo(() => {
    return city.trim().length > 0 && pickup && dropoff;
  }, [city, pickup, dropoff]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { city, pickup, dropoff, carType, budgetMax };
    console.log("CAR SEARCH:", payload);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-[#2a3654]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/" className="text-sm text-[#1F2A44] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors">
          ← Back home
        </a>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
          Car Rental Search
        </h1>
        <p className="mt-2 text-[#2B2B2B] dark:text-[#E5E5E5]">
          Pick a city, dates, type, and budget.
        </p>

        <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-[#E5E5E5] dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-5 md:p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Orlando, FL"
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Car type</label>
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value as CarType)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              >
                <option value="any">Any</option>
                <option value="compact">Compact</option>
                <option value="midsize">Midsize</option>
                <option value="suv">SUV</option>
                <option value="minivan">Minivan</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Pickup date</label>
              <input
                type="date"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Dropoff date</label>
              <input
                type="date"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
                Budget max (per day): <span className="font-semibold">${budgetMax}</span>
              </label>
              <input
                type="range"
                min={25}
                max={400}
                step={5}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg transition
              ${canSubmit ? "bg-[#FFB957] text-[#1F2A44] hover:scale-[1.02]" : "bg-[#E5E5E5] text-[#777] cursor-not-allowed"}`}
          >
            Search Cars
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-[#E5E5E5] dark:border-white/10 p-6 text-[#2B2B2B] dark:text-[#E5E5E5]">
          <div className="font-semibold">Results</div>
          <div className="text-sm opacity-80">Coming next: car cards + supplier logos + save to itinerary.</div>
        </div>
      </div>
    </div>
  );
}
