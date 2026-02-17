"use client";

import { useMemo, useState } from "react";

type Cabin = "economy" | "premium" | "business" | "first";
type TripType = "roundtrip" | "oneway";

export default function FlightsPlanPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState<number>(1);
  const [cabin, setCabin] = useState<Cabin>("economy");

  const canSubmit = useMemo(() => {
    if (!from.trim() || !to.trim() || !depart || passengers < 1) return false;
    if (tripType === "roundtrip" && !returnDate) return false;
    return true;
  }, [from, to, depart, returnDate, passengers, tripType]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { from, to, tripType, depart, returnDate, passengers, cabin };
    console.log("FLIGHT SEARCH:", payload);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-[#2a3654]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/" className="text-sm text-[#1F2A44] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors">
          ← Back home
        </a>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
          Flight Search
        </h1>
        <p className="mt-2 text-[#2B2B2B] dark:text-[#E5E5E5]">
          Search flights by route, dates, passengers, and cabin.
        </p>

        <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-[#E5E5E5] dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-5 md:p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">From (airport/city)</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="SAN"
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">To (airport/city)</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="MCO"
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Trip type</label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as TripType)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              >
                <option value="roundtrip">Round trip</option>
                <option value="oneway">One way</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Cabin</label>
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value as Cabin)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Depart</label>
              <input
                type="date"
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div className={tripType === "oneway" ? "opacity-50 pointer-events-none" : ""}>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Return</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1F2A44]/60 px-4 py-3 text-[#1F2A44] dark:text-[#FAF4EF] outline-none focus:ring-2 focus:ring-[#FFB957]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Passengers</label>
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
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
            Search Flights
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-[#E5E5E5] dark:border-white/10 p-6 text-[#2B2B2B] dark:text-[#E5E5E5]">
          <div className="font-semibold">Results</div>
          <div className="text-sm opacity-80">Coming next: flight list + sort + save to itinerary.</div>
        </div>
      </div>
    </div>
  );
}
