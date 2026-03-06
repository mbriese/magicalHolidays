"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CREATE_TRIP_VALUE = "__create__";
import {
  type AttractionTheme,
  type Attraction,
  themeInfo,
  getAttractionsByTheme,
  getParks,
} from "@/data/attractions";

interface Trip {
  id: string;
  name: string;
  destination: string;
}

interface ItineraryBuilderProps {
  onAddToTrip?: (attraction: Attraction, tripId: string) => void;
}

export default function ItineraryBuilder({ onAddToTrip }: ItineraryBuilderProps) {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<AttractionTheme | null>(null);
  const [selectedPark, setSelectedPark] = useState<string>("all");
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [addingToTrip, setAddingToTrip] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTripSelectChange = (value: string) => {
    if (value === CREATE_TRIP_VALUE) {
      router.push("/trips/new");
      return;
    }
    setSelectedTripId(value);
  };

  const parks = getParks();
  const themes: AttractionTheme[] = ["chill", "thrill", "throwback"];

  // Fetch trips on mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // Update attractions when theme changes
  useEffect(() => {
    if (selectedTheme) {
      let filtered = getAttractionsByTheme(selectedTheme);
      if (selectedPark !== "all") {
        filtered = filtered.filter((a) => a.park === selectedPark);
      }
      setAttractions(filtered);
    } else {
      setAttractions([]);
    }
  }, [selectedTheme, selectedPark]);

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
        if (data.length > 0) {
          setSelectedTripId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const handleAddToTrip = async (attraction: Attraction) => {
    if (!selectedTripId) {
      alert("Please create a trip first!");
      return;
    }

    setIsAdding(true);
    try {
      // Create a reservation for this attraction
      const now = new Date();
      const startTime = new Date(now);
      startTime.setHours(10, 0, 0, 0); // Default to 10 AM
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + attraction.duration);

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: selectedTripId,
          type: "RIDE",
          title: attraction.name,
          startDateTime: startTime.toISOString(),
          endDateTime: endTime.toISOString(),
          location: `${attraction.park} - ${attraction.location}`,
          notes: attraction.tips || attraction.description,
        }),
      });

      if (response.ok) {
        setSuccessMessage(`Added "${attraction.name}" to your trip!`);
        setTimeout(() => setSuccessMessage(null), 3000);
        if (onAddToTrip) {
          onAddToTrip(attraction, selectedTripId);
        }
      }
    } catch (error) {
      console.error("Error adding to trip:", error);
    } finally {
      setIsAdding(false);
      setAddingToTrip(null);
    }
  };

  return (
    <div className="card-magical p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🗺️</span>
          <h2 className="text-xl font-bold text-[#1F2A44] dark:text-[#E5E5E5]">
            Itinerary Builder
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Choose a vibe and discover attractions perfect for your mood
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
          <span>✓</span> {successMessage}
        </div>
      )}

      {/* Theme Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          What's your vibe today?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((theme) => {
            const info = themeInfo[theme];
            const isSelected = selectedTheme === theme;
            return (
              <button
                key={theme}
                onClick={() => setSelectedTheme(isSelected ? null : theme)}
                className={`
                  p-4 rounded-xl border-2 transition-all text-center
                  ${isSelected
                    ? `border-[#FFB957] bg-[#FAF4EF] dark:bg-[#1F2A44]/30 shadow-lg scale-105`
                    : "border-slate-200 dark:border-slate-700 hover:border-[#FFB957] hover:bg-[#FAF4EF]/50 dark:hover:bg-[#1F2A44]/10"
                  }
                `}
              >
                <span className="text-3xl block mb-2">{info.icon}</span>
                <span className={`font-semibold ${isSelected ? "text-[#1F2A44] dark:text-[#FFB957]" : "text-slate-700 dark:text-slate-300"}`}>
                  {info.label}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {info.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Park Filter & Trip Selector */}
      {selectedTheme && (
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filter by Park
            </label>
            <select
              value={selectedPark}
              onChange={(e) => setSelectedPark(e.target.value)}
              className="input-magical"
            >
              <option value="all">All Parks</option>
              {parks.map((park) => (
                <option key={park} value={park}>{park}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Add to Trip
            </label>
            <select
              value={selectedTripId}
              onChange={(e) => handleTripSelectChange(e.target.value)}
              className="input-magical"
            >
              <option value="">No trips yet</option>
              <option value={CREATE_TRIP_VALUE}>Click here to create a new trip</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Attractions Grid */}
      {selectedTheme && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              {themeInfo[selectedTheme].icon} {themeInfo[selectedTheme].label} Attractions
            </h3>
            <span className="text-sm text-slate-500">
              {attractions.length} found
            </span>
          </div>

          {attractions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <span className="text-3xl block mb-2">🔍</span>
              No attractions found for this filter
            </div>
          ) : (
            <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
              {attractions.map((attraction) => (
                <div
                  key={attraction.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-[#FAF4EF] dark:hover:bg-[#1F2A44]/20 transition-colors group"
                >
                  {/* Icon */}
                  <div className="text-2xl shrink-0">{attraction.icon}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                          {attraction.name}
                        </h4>
                        <p className="text-xs text-[#1F2A44] dark:text-[#FFB957]">
                          {attraction.park} • {attraction.location}
                        </p>
                      </div>
                      {/* Theme badges */}
                      <div className="flex gap-1 shrink-0">
                        {attraction.themes.map((t) => (
                          <span
                            key={t}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${themeInfo[t].color} text-white`}
                            title={themeInfo[t].label}
                          >
                            {themeInfo[t].icon}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {attraction.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      <span>⏱️ {attraction.duration} min</span>
                      {attraction.heightRequirement && (
                        <span>📏 {attraction.heightRequirement}" min height</span>
                      )}
                    </div>

                    {/* Tips */}
                    {attraction.tips && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 italic">
                        💡 {attraction.tips}
                      </p>
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => handleAddToTrip(attraction)}
                    disabled={isAdding || !selectedTripId}
                    className="shrink-0 p-2 rounded-lg bg-[#1F2A44]/10 dark:bg-[#1F2A44]/30 text-[#1F2A44] dark:text-[#FFB957] hover:bg-[#FFB957]/30 dark:hover:bg-[#FFB957]/30 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title="Add to trip"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state when no theme selected */}
      {!selectedTheme && (
        <div className="text-center py-8">
          <span className="text-5xl block mb-3">🎠</span>
          <p className="text-slate-600 dark:text-slate-400">
            Select a vibe above to see attraction suggestions
          </p>
        </div>
      )}
    </div>
  );
}

