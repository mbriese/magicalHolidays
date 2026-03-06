"use client";

import { useState, useEffect } from "react";
import { DESTINATIONS } from "@/lib/constants";
import type { TripApiResponse, GuestDetail } from "@/types";

function emptyGuest(): GuestDetail {
  return { firstName: "", lastName: "", type: "adult" };
}

interface EditTripModalProps {
  isOpen: boolean;
  trip: TripApiResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditTripModal({
  isOpen,
  trip,
  onClose,
  onSuccess,
}: EditTripModalProps) {
  // Form state
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [hasAdditionalGuests, setHasAdditionalGuests] = useState<boolean | null>(null);
  const [additionalGuestCount, setAdditionalGuestCount] = useState(1);
  const [guestList, setGuestList] = useState<GuestDetail[]>([]);
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const updateGuest = (index: number, updates: Partial<GuestDetail>) => {
    setGuestList((prev) => {
      const next = [...prev];
      if (!next[index]) next[index] = emptyGuest();
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  // Populate form when trip changes
  useEffect(() => {
    if (trip) {
      setName(trip.name);

      const isKnownDestination = DESTINATIONS.includes(trip.destination as typeof DESTINATIONS[number]);
      if (isKnownDestination) {
        setDestination(trip.destination);
        setCustomDestination("");
      } else {
        setDestination("Other");
        setCustomDestination(trip.destination);
      }

      setStartDate(formatDateForInput(trip.startDate));
      setEndDate(formatDateForInput(trip.endDate));
      setNotes(trip.notes || "");
      setBudgetEnabled(trip.budgetEnabled);
      setBudgetAmount(trip.budgetAmount?.toString() || "");
      setError("");

      const details = trip.guestDetails;
      if (Array.isArray(details) && details.length > 0) {
        setHasAdditionalGuests(true);
        setAdditionalGuestCount(details.length);
        setGuestList(details.map((g) => ({
          firstName: g.firstName ?? "",
          lastName: g.lastName ?? "",
          type: g.type === "child" ? "child" : "adult",
          childAge: g.childAge,
        })));
      } else if (trip.guests?.length) {
        setHasAdditionalGuests(true);
        setAdditionalGuestCount(trip.guests.length);
        setGuestList(trip.guests.map((name) => ({ firstName: name, lastName: "", type: "adult" as const })));
      } else {
        setHasAdditionalGuests(false);
        setAdditionalGuestCount(1);
        setGuestList([]);
      }
    }
  }, [trip]);

  useEffect(() => {
    if (!trip || hasAdditionalGuests !== true || additionalGuestCount < 1) return;
    setGuestList((prev) => {
      if (prev.length === additionalGuestCount) return prev;
      const next = [...prev];
      while (next.length < additionalGuestCount) next.push(emptyGuest());
      return next.slice(0, additionalGuestCount);
    });
  }, [trip, hasAdditionalGuests, additionalGuestCount]);

  const formatDateForInput = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    const finalDestination = destination === "Other" ? customDestination : destination;

    if (!finalDestination) {
      setError("Please select or enter a destination.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          destination: finalDestination,
          startDate,
          endDate,
          notes: notes || null,
          guestDetails: hasAdditionalGuests && guestList.length > 0 ? guestList : [],
          budgetEnabled,
          budgetAmount: budgetEnabled && budgetAmount ? budgetAmount : null,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update trip");
      }
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6 my-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-white">
            Edit Trip ✏️
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trip Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Trip Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-magical"
              placeholder="e.g., Summer Family Vacation 2026"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Destination *
            </label>
            <select
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
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

          {/* Custom Destination */}
          {destination === "Other" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Enter Destination *
              </label>
              <input
                type="text"
                required
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                className="input-magical"
                placeholder="Enter your destination"
              />
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-magical"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="input-magical"
              />
            </div>
          </div>

          {/* Additional guests */}
          <div className="space-y-3">
            <p className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Will you be traveling with additional guests?
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="edit-hasAdditionalGuests"
                  checked={hasAdditionalGuests === true}
                  onChange={() => setHasAdditionalGuests(true)}
                  className="w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="edit-hasAdditionalGuests"
                  checked={hasAdditionalGuests === false}
                  onChange={() => setHasAdditionalGuests(false)}
                  className="w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
            {hasAdditionalGuests === true && (
              <>
                <div>
                  <label htmlFor="edit-additionalGuestCount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    How many additional guests?
                  </label>
                  <input
                    id="edit-additionalGuestCount"
                    type="number"
                    min={1}
                    max={20}
                    value={additionalGuestCount}
                    onChange={(e) => setAdditionalGuestCount(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
                    className="input-magical w-24"
                  />
                </div>
                {guestList.length > 0 && (
                  <div className="space-y-3 p-3 rounded-xl bg-[#FAF4EF] dark:bg-[#1F2A44]/20 border border-[#E5E5E5] dark:border-midnight-500">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Guest details</span>
                    {guestList.map((guest, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="First name"
                          value={guest.firstName}
                          onChange={(e) => updateGuest(index, { firstName: e.target.value })}
                          className="input-magical text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          value={guest.lastName}
                          onChange={(e) => updateGuest(index, { lastName: e.target.value })}
                          className="input-magical text-sm"
                        />
                        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                          <span className="text-xs text-slate-600 dark:text-slate-400">Type:</span>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`edit-guest-type-${index}`}
                              checked={guest.type === "adult"}
                              onChange={() => updateGuest(index, { type: "adult", childAge: undefined })}
                              className="w-3 h-3 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                            />
                            <span className="text-xs">Adult</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`edit-guest-type-${index}`}
                              checked={guest.type === "child"}
                              onChange={() => updateGuest(index, { type: "child" })}
                              className="w-3 h-3 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                            />
                            <span className="text-xs">Child</span>
                          </label>
                          {guest.type === "child" && (
                            <>
                              <label htmlFor={`edit-child-age-${index}`} className="text-xs text-slate-500 dark:text-slate-400">Age:</label>
                              <input
                                id={`edit-child-age-${index}`}
                                type="number"
                                min={0}
                                max={17}
                                value={guest.childAge ?? ""}
                                onChange={(e) => updateGuest(index, { childAge: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                                className="input-magical w-14 text-sm"
                                placeholder="—"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Budget */}
          <div className="p-4 rounded-xl bg-[#FAF4EF] dark:bg-[#1F2A44]/20 border border-[#E5E5E5] dark:border-midnight-500">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={budgetEnabled}
                onChange={(e) => setBudgetEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-[#1F2A44] focus:ring-[#FFB957]"
              />
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  💰 Track Trip Budget
                </span>
              </div>
            </label>

            {budgetEnabled && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Budget Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="input-magical pl-8"
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="input-magical resize-none"
              placeholder="Any special plans or reminders..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg font-semibold border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-magical flex-1 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

