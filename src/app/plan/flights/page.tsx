"use client";

import { useMemo, useState } from "react";
import { SearchPageLayout } from "@/components/SearchPageLayout";
import { DateInput } from "@/components/DateInput";

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
    <SearchPageLayout
      title="Flight Search"
      description="Search flights by route, dates, passengers, and cabin."
      submitLabel="Search Flights"
      canSubmit={canSubmit}
      onSubmit={onSubmit}
      resultsNote="Coming next: flight list + sort + save to itinerary."
    >
      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">From (airport/city)</label>
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="SAN" className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">To (airport/city)</label>
        <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="MCO" className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Trip type</label>
        <select value={tripType} onChange={(e) => setTripType(e.target.value as TripType)} className="mt-1 input-magical">
          <option value="roundtrip">Round trip</option>
          <option value="oneway">One way</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Cabin</label>
        <select value={cabin} onChange={(e) => setCabin(e.target.value as Cabin)} className="mt-1 input-magical">
          <option value="economy">Economy</option>
          <option value="premium">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Depart</label>
        <DateInput value={depart} onChange={setDepart} className="mt-1 input-magical" />
      </div>

      <div className={tripType === "oneway" ? "opacity-50 pointer-events-none" : ""}>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Return</label>
        <DateInput value={returnDate} onChange={setReturnDate} className="mt-1 input-magical" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2A44] dark:text-[#FAF4EF]">Passengers</label>
        <input type="number" min={1} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="mt-1 input-magical" />
      </div>
    </SearchPageLayout>
  );
}
