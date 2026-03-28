"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { DESTINATIONS } from "@/lib/constants";
import type { GuestDetail, TripApiResponse } from "@/types";
import { Spinner } from "@/components/Spinner";
import { StatusMessage } from "@/components/StatusMessage";
import { DateInput } from "@/components/DateInput";

interface CreatedTrip {
  id: string;
  name: string;
  destination: string;
}

function emptyGuest(): GuestDetail {
  return { firstName: "", lastName: "", type: "adult" };
}

export default function NewTripPage() {
  const { data: session } = useSession();
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTrip, setCreatedTrip] = useState<CreatedTrip | null>(null);
  const [existingTrips, setExistingTrips] = useState<TripApiResponse[]>([]);
  const [overlapConfirmed, setOverlapConfirmed] = useState(false);

  useEffect(() => {
    fetch("/api/trips")
      .then((r) => (r.ok ? r.json() : []))
      .then(setExistingTrips)
      .catch(() => {});
  }, []);

  const isDuplicateName = useMemo(() => {
    if (!name.trim()) return false;
    return existingTrips.some(
      (t) => t.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
  }, [name, existingTrips]);

  const overlappingTrips = useMemo(() => {
    if (!startDate || !endDate) return [];
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    return existingTrips.filter((t) => {
      const ts = new Date(t.startDate).getTime();
      const te = new Date(t.endDate).getTime();
      return s <= te && ts <= e;
    });
  }, [startDate, endDate, existingTrips]);

  useEffect(() => {
    setOverlapConfirmed(false);
  }, [startDate, endDate]);

  // When count changes, resize guestList and preserve existing entries
  useEffect(() => {
    if (!hasAdditionalGuests || additionalGuestCount < 1) {
      setGuestList([]);
      return;
    }
    setGuestList((prev) => {
      const next = [...prev];
      while (next.length < additionalGuestCount) next.push(emptyGuest());
      return next.slice(0, additionalGuestCount);
    });
  }, [hasAdditionalGuests, additionalGuestCount]);

  const updateGuest = (index: number, updates: Partial<GuestDetail>) => {
    setGuestList((prev) => {
      const next = [...prev];
      if (!next[index]) next[index] = emptyGuest();
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const finalDestination =
      destination === "Other" ? customDestination : destination;

    if (!finalDestination) {
      setError("Please select or enter a destination.");
      setIsLoading(false);
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be after start date.");
      setIsLoading(false);
      return;
    }

    if (isDuplicateName) {
      setError(`You already have a trip named "${name.trim()}". Please choose a different name.`);
      setIsLoading(false);
      return;
    }

    if (overlappingTrips.length > 0 && !overlapConfirmed) {
      setError("Please review the date overlap warning below and confirm before creating this trip.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          destination: finalDestination,
          startDate,
          endDate,
          notes: notes || null,
          guestDetails: hasAdditionalGuests && guestList.length > 0 ? guestList : undefined,
          budgetEnabled,
          budgetAmount: budgetEnabled && budgetAmount ? parseFloat(budgetAmount) : null,
        }),
      });

      if (response.ok) {
        // Show success modal with gentle account prompt
        const trip = await response.json();
        setCreatedTrip(trip);
        setShowSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create trip. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-[#1F2A44] to-midnight-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            Create New Trip ✨
          </h1>
          <p className="text-[#E5E5E5]">
            {session?.user?.name
              ? `Crafting your next magical adventure, ${session.user.name}!`
              : "Start planning your next magical adventure"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-magical p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <StatusMessage message={error} isError />

            {/* Trip Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Trip Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`input-magical ${isDuplicateName ? "border-red-400! dark:border-red-500!" : ""}`}
                placeholder="e.g., Summer Family Vacation 2026"
              />
              {isDuplicateName && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                  You already have a trip named &ldquo;{name.trim()}&rdquo;. Please choose a different name.
                </p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Destination *
              </label>
              <select
                id="destination"
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
                <label
                  htmlFor="customDestination"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Enter Destination *
                </label>
                <input
                  id="customDestination"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Start Date *
                </label>
                <DateInput
                  id="startDate"
                  required
                  value={startDate}
                  onChange={setStartDate}
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  End Date *
                </label>
                <DateInput
                  id="endDate"
                  required
                  value={endDate}
                  onChange={setEndDate}
                  min={startDate}
                />
              </div>
            </div>

            {/* Date overlap warning */}
            {overlappingTrips.length > 0 && (
              <div className="rounded-xl border-2 border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">⚠️</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-800 dark:text-amber-300 text-base mb-2">
                      This trip might already exist!
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                      Your dates overlap with {overlappingTrips.length === 1 ? "an existing trip" : `${overlappingTrips.length} existing trips`}:
                    </p>
                    <ul className="space-y-2 mb-4">
                      {overlappingTrips.map((t) => (
                        <li key={t.id} className="flex items-center gap-2 text-sm bg-white/60 dark:bg-black/20 rounded-lg px-3 py-2">
                          <span className="font-semibold text-amber-900 dark:text-amber-200">{t.name}</span>
                          <span className="text-amber-600 dark:text-amber-400">
                            {new Date(t.startDate).toLocaleDateString()} – {new Date(t.endDate).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overlapConfirmed}
                        onChange={(e) => setOverlapConfirmed(e.target.checked)}
                        className="w-4 h-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        I understand — this is a different trip
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Additional guests */}
            <div className="space-y-4">
              <p className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Will you be traveling with additional guests?
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasAdditionalGuests"
                    checked={hasAdditionalGuests === true}
                    onChange={() => setHasAdditionalGuests(true)}
                    className="w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasAdditionalGuests"
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
                    <label htmlFor="additionalGuestCount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      How many additional guests?
                    </label>
                    <input
                      id="additionalGuestCount"
                      type="number"
                      min={1}
                      max={20}
                      value={additionalGuestCount}
                      onChange={(e) => setAdditionalGuestCount(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
                      className="input-magical w-24"
                    />
                  </div>
                  {guestList.length > 0 && (
                    <div className="space-y-4 p-4 rounded-xl bg-[#FAF4EF] dark:bg-[#1F2A44]/20 border border-[#E5E5E5] dark:border-midnight-500">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Guest details
                      </span>
                      {guestList.map((guest, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="First name"
                            value={guest.firstName}
                            onChange={(e) => updateGuest(index, { firstName: e.target.value })}
                            className="input-magical"
                          />
                          <input
                            type="text"
                            placeholder="Last name"
                            value={guest.lastName}
                            onChange={(e) => updateGuest(index, { lastName: e.target.value })}
                            className="input-magical"
                          />
                          <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Type:</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`guest-type-${index}`}
                                checked={guest.type === "adult"}
                                onChange={() => updateGuest(index, { type: "adult", childAge: undefined })}
                                className="w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                              />
                              <span className="text-sm">Adult</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`guest-type-${index}`}
                                checked={guest.type === "child"}
                                onChange={() => updateGuest(index, { type: "child" })}
                                className="w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                              />
                              <span className="text-sm">Child</span>
                            </label>
                            {guest.type === "child" && (
                              <>
                                <label htmlFor={`child-age-${index}`} className="text-sm text-slate-600 dark:text-slate-400">
                                  Age:
                                </label>
                                <input
                                  id={`child-age-${index}`}
                                  type="number"
                                  min={0}
                                  max={17}
                                  value={guest.childAge ?? ""}
                                  onChange={(e) => updateGuest(index, { childAge: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                                  className="input-magical w-16"
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

            {/* Budget Setup */}
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Set a budget and track expenses throughout your trip
                  </p>
                </div>
              </label>

              {budgetEnabled && (
                <div className="mt-4">
                  <label
                    htmlFor="budgetAmount"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Budget Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      id="budgetAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      className="input-magical pl-8!"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    You can add expenses and track spending from your dashboard
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="input-magical resize-none"
                placeholder="Any special plans, reminders, or notes for this trip..."
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading || isDuplicateName}
                className="btn-magical flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Spinner className="-ml-1 mr-3 h-5 w-5 text-white" />
                    Creating...
                  </span>
                ) : (
                  "Create Trip ✨"
                )}
              </button>
              <a
                href="/trips"
                className="btn-outline text-center flex-1 sm:flex-none"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 p-6 bg-[#FAF4EF] dark:bg-[#1F2A44]/20 rounded-xl">
          <h3 className="font-semibold text-[#1F2A44] dark:text-[#E5E5E5] mb-3">
            💡 Planning Tips
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              • Create your trip first, then add reservations to keep everything
              organized
            </li>
            <li>
              • Invite family members or travel companions to collaborate on the
              trip
            </li>
            <li>
              • Use notes to track important reminders or must-do activities
            </li>
          </ul>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && createdTrip && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccess(false)}
        >
          <div className="card-magical max-w-md w-full p-8 text-center animate-scale-in relative" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Celebration */}
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-white mb-2">
              Trip Created!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              <span className="font-semibold text-[#1F2A44] dark:text-[#FFB957]">{createdTrip.name}</span> to {createdTrip.destination} is ready for planning!
            </p>

            {/* Primary Action - Continue to Trip */}
            <a
              href={`/trips/${createdTrip.id}`}
              className="btn-gold w-full mb-4"
            >
              ✨ Add Reservations ✨
            </a>

            {/* Secondary Action - View All Trips */}
            <a
              href="/trips"
              className="btn-outline w-full mb-6"
            >
              View My Trips
            </a>

            {/* Gentle Account Prompt */}
            <div className="pt-6 border-t border-[#E5E5E5] dark:border-midnight-500">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                💡 Want to access your trips from any device?
              </p>
              <a
                href="/register"
                className="text-[#1F2A44] dark:text-[#FFB957] font-medium text-sm hover:underline"
              >
                Create a free account to save your data →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

