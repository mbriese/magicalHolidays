"use client";

import { useState } from "react";
import { DESTINATIONS, RESERVATION_TYPES } from "@/lib/constants";
import type { ReservationType } from "@/types";

interface PlannedItem {
  id: string;
  type: ReservationType;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  confirmationNumber?: string;
  notes?: string;
}

const typeIcons: Record<ReservationType, string> = {
  PARK: "🏰",
  RIDE: "🎢",
  HOTEL: "🏨",
  CAR: "🚗",
  FLIGHT: "✈️",
};

const typeLabels: Record<ReservationType, string> = {
  PARK: "Park Visit",
  RIDE: "Ride / Attraction",
  HOTEL: "Hotel",
  CAR: "Car Rental",
  FLIGHT: "Flight",
};

export default function QuickPlanPage() {
  const [items, setItems] = useState<PlannedItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<ReservationType | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  // Form state for adding items
  const [itemTitle, setItemTitle] = useState("");
  const [itemStart, setItemStart] = useState("");
  const [itemEnd, setItemEnd] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const [itemConfirmation, setItemConfirmation] = useState("");
  const [itemNotes, setItemNotes] = useState("");
  
  // Trip save form state
  const [tripName, setTripName] = useState("");
  const [tripDestination, setTripDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [tripNotes, setTripNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const resetItemForm = () => {
    setItemTitle("");
    setItemStart("");
    setItemEnd("");
    setItemLocation("");
    setItemConfirmation("");
    setItemNotes("");
    setSelectedType(null);
    setShowAddForm(false);
  };

  const handleAddItem = () => {
    if (!selectedType || !itemTitle || !itemStart) return;

    const newItem: PlannedItem = {
      id: Date.now().toString(),
      type: selectedType,
      title: itemTitle,
      startDateTime: itemStart,
      endDateTime: itemEnd || itemStart,
      location: itemLocation || undefined,
      confirmationNumber: itemConfirmation || undefined,
      notes: itemNotes || undefined,
    };

    setItems([...items, newItem]);
    resetItemForm();
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSaveTrip = async () => {
    if (!tripName.trim()) {
      setSaveError("Please give your trip a name");
      return;
    }

    const finalDestination = tripDestination === "Other" ? customDestination : tripDestination;
    if (!finalDestination) {
      setSaveError("Please select a destination");
      return;
    }

    if (items.length === 0) {
      setSaveError("Add at least one reservation to save your trip");
      return;
    }

    setIsSaving(true);
    setSaveError("");

    // Calculate trip dates from items
    const dates = items.flatMap((item) => [
      new Date(item.startDateTime),
      new Date(item.endDateTime),
    ]);
    const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    try {
      // Create the trip
      const tripResponse = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tripName,
          destination: finalDestination,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          notes: tripNotes || null,
        }),
      });

      if (!tripResponse.ok) {
        throw new Error("Failed to create trip");
      }

      const trip = await tripResponse.json();

      // Create all reservations
      for (const item of items) {
        await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tripId: trip.id,
            type: item.type,
            title: item.title,
            startDateTime: item.startDateTime,
            endDateTime: item.endDateTime,
            location: item.location || null,
            confirmationNumber: item.confirmationNumber || null,
            notes: item.notes || null,
          }),
        });
      }

      // Redirect to trip page
      window.location.href = `/trips/${trip.id}`;
    } catch {
      setSaveError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getDateRange = () => {
    if (items.length === 0) return null;
    const dates = items.flatMap((item) => [
      new Date(item.startDateTime),
      new Date(item.endDateTime),
    ]);
    const start = new Date(Math.min(...dates.map((d) => d.getTime())));
    const end = new Date(Math.max(...dates.map((d) => d.getTime())));
    return {
      start: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      end: end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  };

  const dateRange = getDateRange();

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-[#1F2A44] to-midnight-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            ✨ Quick Planner ✨
          </h1>
          <p className="text-[#E5E5E5]">
            Add your reservations first, name your trip when you&apos;re ready to save
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Add Buttons */}
        <div className="section-outlined mb-8">
          <span className="section-title">Start an Adventure</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {RESERVATION_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setShowAddForm(true);
                }}
                className="card-stat p-4 text-center hover:scale-105 transition-transform"
                style={{ "--stat-accent": type === "PARK" ? "#1F2A44" : type === "RIDE" ? "#FFB957" : type === "HOTEL" ? "#F8AFA6" : type === "CAR" ? "#A7D2B7" : "#677595" } as React.CSSProperties}
              >
                <span className="text-3xl block mb-2">{typeIcons[type]}</span>
                <span className="text-sm font-medium text-[#1F2A44] dark:text-white">
                  {typeLabels[type]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Added Items List */}
        {items.length > 0 && (
          <div className="section-outlined mb-8">
            <span className="section-title">
              Your Plan {dateRange && `(${dateRange.start} - ${dateRange.end})`}
            </span>
            <div className="space-y-3 pt-2">
              {items
                .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
                .map((item) => (
                  <div
                    key={item.id}
                    className="card-trip p-4 flex items-center gap-4"
                  >
                    <span className="text-2xl">{typeIcons[item.type]}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1F2A44] dark:text-white truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(item.startDateTime).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                      {item.location && (
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          📍 {item.location}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>

            {/* Save Trip Button */}
            <div className="mt-6 pt-4 border-t border-[#E5E5E5] dark:border-midnight-500">
              <button
                onClick={() => setShowSaveModal(true)}
                className="btn-gold w-full"
              >
                ✨ Save as Trip ✨
              </button>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                {items.length} {items.length === 1 ? "item" : "items"} ready to save
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">🗓️</span>
            <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-white mb-2">
              Start Adding Your Plans
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Click any button above to add a hotel, ride, flight, or other reservation. 
              You can name and save your trip once you&apos;ve added what you need.
            </p>
          </div>
        )}

        {/* Add Item Form Modal */}
        {showAddForm && selectedType && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-magical max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{typeIcons[selectedType]}</span>
                <h2 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-white">
                  Add {typeLabels[selectedType]}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {selectedType === "HOTEL" ? "Hotel Name" : selectedType === "FLIGHT" ? "Flight Details" : "Name / Title"} *
                  </label>
                  <input
                    type="text"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="input-magical"
                    placeholder={
                      selectedType === "HOTEL" ? "e.g., Grand Floridian Resort" :
                      selectedType === "FLIGHT" ? "e.g., Delta 1234 to Orlando" :
                      selectedType === "RIDE" ? "e.g., Space Mountain Lightning Lane" :
                      selectedType === "CAR" ? "e.g., Enterprise Rental" :
                      "e.g., Magic Kingdom"
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {selectedType === "HOTEL" ? "Check-in" : "Start"} *
                    </label>
                    <input
                      type="datetime-local"
                      value={itemStart}
                      onChange={(e) => setItemStart(e.target.value)}
                      className="input-magical"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {selectedType === "HOTEL" ? "Check-out" : "End"}
                    </label>
                    <input
                      type="datetime-local"
                      value={itemEnd}
                      onChange={(e) => setItemEnd(e.target.value)}
                      min={itemStart}
                      className="input-magical"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={itemLocation}
                    onChange={(e) => setItemLocation(e.target.value)}
                    className="input-magical"
                    placeholder="e.g., Orlando, FL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirmation #
                  </label>
                  <input
                    type="text"
                    value={itemConfirmation}
                    onChange={(e) => setItemConfirmation(e.target.value)}
                    className="input-magical"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    className="input-magical resize-none"
                    rows={2}
                    placeholder="Any additional details..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddItem}
                  disabled={!itemTitle || !itemStart}
                  className="btn-magical flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Plan
                </button>
                <button
                  onClick={resetItemForm}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Trip Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-magical max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-white mb-2">
                Save Your Trip ✨
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Give your trip a name and we&apos;ll save everything together.
              </p>

              {saveError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm mb-4">
                  {saveError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Trip Name *
                  </label>
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    className="input-magical"
                    placeholder="e.g., Summer Family Vacation 2026"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Destination *
                  </label>
                  <select
                    value={tripDestination}
                    onChange={(e) => setTripDestination(e.target.value)}
                    className="input-magical"
                  >
                    <option value="">Select a destination</option>
                    {DESTINATIONS.map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>

                {tripDestination === "Other" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Enter Destination *
                    </label>
                    <input
                      type="text"
                      value={customDestination}
                      onChange={(e) => setCustomDestination(e.target.value)}
                      className="input-magical"
                      placeholder="Enter your destination"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={tripNotes}
                    onChange={(e) => setTripNotes(e.target.value)}
                    className="input-magical resize-none"
                    rows={2}
                    placeholder="Any notes about this trip..."
                  />
                </div>

                {dateRange && (
                  <div className="p-3 bg-[#FAF4EF] dark:bg-[#1F2A44]/20 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      📅 Trip dates: <span className="font-medium">{dateRange.start} - {dateRange.end}</span>
                      <br />
                      <span className="text-xs">(calculated from your {items.length} reservations)</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveTrip}
                  disabled={isSaving}
                  className="btn-gold flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "✨ Save Trip ✨"}
                </button>
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setSaveError("");
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>

              {/* Gentle Account Prompt */}
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] dark:border-midnight-500 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  💡 Want to access your trips from any device?
                </p>
                <a
                  href="/register"
                  className="text-[#1F2A44] dark:text-[#FFB957] font-medium text-sm hover:underline"
                >
                  Create a free account →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
