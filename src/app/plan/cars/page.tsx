"use client";

import { useMemo, useState } from "react";
import { SearchPageLayout } from "@/components/SearchPageLayout";
import { DateInput } from "@/components/DateInput";

type CarType = "any" | "compact" | "midsize" | "suv" | "minivan" | "luxury";

export default function CarsPlanPage() {
  const [city, setCity] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [carType, setCarType] = useState<CarType>("any");

  const canSubmit = useMemo(() => {
    return city.trim().length > 0 && !!pickup && !!dropoff;
  }, [city, pickup, dropoff]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { city, pickup, dropoff, carType };
    console.log("CAR SEARCH:", payload);
  }

  return (
    <SearchPageLayout
      title="Car Rental Search"
      description="Pick a city, dates, and type."
      submitLabel="Search Cars"
      canSubmit={canSubmit}
      onSubmit={onSubmit}
      resultsNote="Coming next: car cards + supplier logos + save to itinerary."
    >
      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Orlando, FL" className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Car type</label>
        <select value={carType} onChange={(e) => setCarType(e.target.value as CarType)} className="mt-1 input-magical">
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
        <DateInput value={pickup} onChange={setPickup} className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Dropoff date</label>
        <DateInput value={dropoff} onChange={setDropoff} className="mt-1 input-magical" />
      </div>
    </SearchPageLayout>
  );
}
