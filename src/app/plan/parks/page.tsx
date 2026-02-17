"use client";

import { useMemo, useState } from "react";

type ParkType = "theme-park" | "water-park" | "event" | "other";

export default function ParksPlanPage() {
  const [destination, setDestination] = useState("");
  const [parkType, setParkType] = useState<ParkType>("theme-park");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState<number>(1);

  const canSubmit = useMemo(() => {
    return destination.trim().length > 0 && startDate && days >= 1;
  }, [destination, startDate, days]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { destination, parkType, startDate, days };
    console.log("ATTRACTIONS SEARCH:", payload);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-[#2a3654]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/" className="text-sm text-[#1F2A44] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors">
          ← Back home
        </a>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
          Attractions & Park Days
        </h1>
        <p className="mt-2 text-[#2B2B2B] dark:text-[#E5E5E5]">
          Start with destination + dates. Add tickets, dining, and daily plans next.
        </p>

        <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-[#E5E5E5] dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-5 md:p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Destination</label>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Disneyland Resort"
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Type</label>
              <select
                value={parkType}
                onChange={(e) => setParkType(e.target.value as ParkType)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              >
                <option value="theme-park">Theme park</option>
                <option value="water-park">Water park</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Number of days</label>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg transition
              ${canSubmit ? "bg-[#FFB957] text-[#1F2A44] hover:scale-[1.02]" : "bg-[#E5E5E5] text-[#777] cursor-not-allowed"}`}
          >
            Start Planning Days
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-[#E5E5E5] dark:border-white/10 p-6 text-[#2B2B2B] dark:text-[#E5E5E5]">
          <div className="font-semibold">Next steps</div>
          <div className="text-sm opacity-80">
            Coming next: day-by-day itinerary builder, dining placeholders, and “must-do” lists.
          </div>
        </div>
      </div>
    </div>
  );
}
