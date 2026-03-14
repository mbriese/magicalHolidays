"use client";

import { useState, useEffect } from "react";
import { DESTINATIONS } from "@/lib/constants";
import type { TripApiResponse } from "@/types";

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
  const [guests, setGuests] = useState<string[]>([]);
  const [newGuestName, setNewGuestName] = useState("");
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Guest management functions
  const handleAddGuest = () => {
    const trimmedName = newGuestName.trim();
    if (trimmedName && !guests.includes(trimmedName)) {
      setGuests([...guests, trimmedName]);
      setNewGuestName("");
    }
  };

  const handleRemoveGuest = (guestToRemove: string) => {
    setGuests(guests.filter((g) => g !== guestToRemove));
  };

  const handleGuestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGuest();
    }
  };

  // Populate form when trip changes
  useEffect(() => {
    if (trip) {
      setName(trip.name);

      // Check if destination is in the list or custom
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
      setGuests(trip.guests || []);
      setBudgetEnabled(trip.budgetEnabled);
      setBudgetAmount(trip.budgetAmount?.toString() || "");
      setError("");
    }
  }, [trip]);

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
          guests,
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
          <h2 className="font-serif text-2xl font-bold text-purple-900 dark:text-white">
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

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              👥 Who&apos;s Going?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                onKeyDown={handleGuestKeyDown}
                placeholder="Enter guest name..."
                className="input-magical flex-1"
              />
              <button
                type="button"
                onClick={handleAddGuest}
                disabled={!newGuestName.trim()}
                className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Add
              </button>
            </div>
            {guests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {guests.map((guest) => (
                  <span
                    key={guest}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs"
                  >
                    👤 {guest}
                    <button
                      type="button"
                      onClick={() => handleRemoveGuest(guest)}
                      className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={budgetEnabled}
                onChange={(e) => setBudgetEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
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
