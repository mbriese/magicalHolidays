"use client";

import { useState } from "react";

const destinations = [
  "Walt Disney World",
  "Disneyland Resort",
  "Tokyo Disney Resort",
  "Disneyland Paris",
  "Hong Kong Disneyland",
  "Shanghai Disney Resort",
  "Other",
];

export default function NewTripPage() {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
          budgetEnabled,
          budgetAmount: budgetEnabled && budgetAmount ? parseFloat(budgetAmount) : null,
        }),
      });

      if (response.ok) {
        // Redirect to trips page on success
        window.location.href = "/trips";
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
      <div className="bg-linear-to-r from-purple-600 to-purple-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            Create New Trip ✨
          </h1>
          <p className="text-purple-100">
            Start planning your next magical adventure
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-magical p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

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
                className="input-magical"
                placeholder="e.g., Summer Family Vacation 2026"
              />
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
                {destinations.map((dest) => (
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
                <input
                  id="startDate"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-magical"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  End Date *
                </label>
                <input
                  id="endDate"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="input-magical"
                />
              </div>
            </div>

            {/* Budget Setup */}
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
                      className="input-magical pl-8"
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
                disabled={isLoading}
                className="btn-magical flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
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
        <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
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
    </div>
  );
}
