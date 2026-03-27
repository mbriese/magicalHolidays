"use client";

import { useMemo, useState } from "react";
import { SearchPageLayout } from "@/components/SearchPageLayout";
import { DateInput } from "@/components/DateInput";

type ParkType = "theme-park" | "water-park" | "event" | "other";

export default function ParksPlanPage() {
  const [destination, setDestination] = useState("");
  const [parkType, setParkType] = useState<ParkType>("theme-park");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState<number>(1);

  const canSubmit = useMemo(() => {
    return destination.trim().length > 0 && !!startDate && days >= 1;
  }, [destination, startDate, days]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { destination, parkType, startDate, days };
    console.log("ATTRACTIONS SEARCH:", payload);
  }

  return (
    <SearchPageLayout
      title="Attractions & Park Days"
      description="Start with destination + dates. Add tickets, dining, and daily plans next."
      submitLabel="Start Planning Days"
      canSubmit={canSubmit}
      onSubmit={onSubmit}
      resultsNote="Coming next: day-by-day itinerary builder, dining placeholders, and &ldquo;must-do&rdquo; lists."
    >
      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Destination</label>
        <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Disneyland Resort" className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Type</label>
        <select value={parkType} onChange={(e) => setParkType(e.target.value as ParkType)} className="mt-1 input-magical">
          <option value="theme-park">Theme park</option>
          <option value="water-park">Water park</option>
          <option value="event">Event</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Start date</label>
        <DateInput value={startDate} onChange={setStartDate} className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Number of days</label>
        <input type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-1 input-magical" />
      </div>
    </SearchPageLayout>
  );
}
