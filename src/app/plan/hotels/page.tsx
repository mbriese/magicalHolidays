"use client";

import { useMemo, useState } from "react";
import { SearchPageLayout } from "@/components/SearchPageLayout";

type BudgetRange = "any" | "0-150" | "150-300" | "300-500" | "500+";

export default function HotelsPlanPage() {
  const [city, setCity] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [guests, setGuests] = useState<number>(2);
  const [budget, setBudget] = useState<BudgetRange>("any");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const canSubmit = useMemo(() => {
    return city.trim().length > 0 && !!checkIn && !!checkOut && guests > 0;
  }, [city, checkIn, checkOut, guests]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { city, hotelName, guests, budget, checkIn, checkOut };
    console.log("HOTEL SEARCH:", payload);
  }

  return (
    <SearchPageLayout
      title="Hotel Search"
      description="Find a stay that fits your dates, guests, and budget."
      submitLabel="Search Hotels"
      canSubmit={canSubmit}
      onSubmit={onSubmit}
      resultsNote="Coming next: show hotel cards, filters, and save-to-itinerary actions."
    >
      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Anaheim, CA" className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Hotel name (optional)</label>
        <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} placeholder="Grand Californian" className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Guests</label>
        <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Budget (per night)</label>
        <select value={budget} onChange={(e) => setBudget(e.target.value as BudgetRange)} className="mt-1 input-magical">
          <option value="any">Any</option>
          <option value="0-150">$0–$150</option>
          <option value="150-300">$150–$300</option>
          <option value="300-500">$300–$500</option>
          <option value="500+">$500+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Check-in</label>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Check-out</label>
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 input-magical" />
      </div>
    </SearchPageLayout>
  );
}
