"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { reservationLabels, type ReservationType } from "@/types";

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const reservationTypes: ReservationType[] = ["PARK", "RIDE", "HOTEL", "CAR", "FLIGHT"];

const destinations = [
  "Walt Disney World",
  "Disneyland Resort",
  "Tokyo Disney Resort",
  "Disneyland Paris",
  "Hong Kong Disneyland",
  "Shanghai Disney Resort",
  "Other",
];

export default function AddReservationModal({
  isOpen,
  onClose,
  onSuccess,
}: AddReservationModalProps) {
  // Trip selection
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // New trip fields
  const [newTripName, setNewTripName] = useState("");
  const [newTripDestination, setNewTripDestination] = useState("");
  const [newTripStartDate, setNewTripStartDate] = useState<Date | null>(null);
  const [newTripEndDate, setNewTripEndDate] = useState<Date | null>(null);

  // Reservation fields
  const [type, setType] = useState<ReservationType>("PARK");
  const [title, setTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch trips on mount
  useEffect(() => {
    if (isOpen) {
      fetchTrips();
    }
  }, [isOpen]);

  const fetchTrips = async () => {
    setLoadingTrips(true);
    try {
      const response = await fetch("/api/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
        if (data.length === 0) {
          setIsCreatingTrip(true);
        } else {
          setSelectedTripId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleTripChange = (value: string) => {
    if (value === "new") {
      setIsCreatingTrip(true);
      setSelectedTripId("");
    } else {
      setIsCreatingTrip(false);
      setSelectedTripId(value);
    }
  };

  const createTrip = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTripName,
          destination: newTripDestination,
          startDate: newTripStartDate?.toISOString(),
          endDate: newTripEndDate?.toISOString(),
        }),
      });

      if (response.ok) {
        const trip = await response.json();
        return trip.id;
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to create trip");
      }
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let tripId = selectedTripId;

      // Create new trip if needed
      if (isCreatingTrip) {
        if (!newTripName || !newTripDestination || !newTripStartDate || !newTripEndDate) {
          setError("Please fill in all trip details");
          setIsLoading(false);
          return;
        }
        const newTripId = await createTrip();
        if (!newTripId) {
          setError("Failed to create trip");
          setIsLoading(false);
          return;
        }
        tripId = newTripId;
      }

      // Validate reservation fields
      if (!tripId || !title || !startDateTime || !endDateTime) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Create reservation
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          type,
          title,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          location: location || null,
          confirmationNumber: confirmationNumber || null,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        // Reset form
        resetForm();
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create reservation");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTripId(trips.length > 0 ? trips[0].id : "");
    setIsCreatingTrip(trips.length === 0);
    setNewTripName("");
    setNewTripDestination("");
    setNewTripStartDate(null);
    setNewTripEndDate(null);
    setType("PARK");
    setTitle("");
    setStartDateTime(null);
    setEndDateTime(null);
    setIsAllDay(false);
    setLocation("");
    setConfirmationNumber("");
    setNotes("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6 my-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-serif text-2xl font-bold text-purple-900 dark:text-white">
            Add Reservation ✨
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
          {/* Trip Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Trip *
            </label>
            {loadingTrips ? (
              <div className="text-slate-500">Loading trips...</div>
            ) : (
              <select
                value={isCreatingTrip ? "new" : selectedTripId}
                onChange={(e) => handleTripChange(e.target.value)}
                className="input-magical"
              >
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name} ({trip.destination})
                  </option>
                ))}
                <option value="new">+ Create New Trip</option>
              </select>
            )}
          </div>

          {/* New Trip Fields */}
          {isCreatingTrip && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-3">
              <h3 className="font-medium text-purple-900 dark:text-purple-100">New Trip Details</h3>
              <input
                type="text"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="Trip name (e.g., Summer Vacation 2026)"
                className="input-magical"
              />
              <select
                value={newTripDestination}
                onChange={(e) => setNewTripDestination(e.target.value)}
                className="input-magical"
              >
                <option value="">Select destination</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Trip Start</label>
                  <DatePicker
                    selected={newTripStartDate}
                    onChange={(date: Date | null) => setNewTripStartDate(date)}
                    className="input-magical w-full"
                    placeholderText="Start date"
                    dateFormat="MMM d, yyyy"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Trip End</label>
                  <DatePicker
                    selected={newTripEndDate}
                    onChange={(date: Date | null) => setNewTripEndDate(date)}
                    className="input-magical w-full"
                    placeholderText="End date"
                    dateFormat="MMM d, yyyy"
                    minDate={newTripStartDate || undefined}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reservation Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Reservation Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ReservationType)}
              className="input-magical"
            >
              {reservationTypes.map((t) => (
                <option key={t} value={t}>
                  {reservationLabels[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === "PARK" ? "e.g., Magic Kingdom" : type === "RIDE" ? "e.g., Space Mountain" : type === "HOTEL" ? "e.g., Grand Floridian" : type === "CAR" ? "e.g., Hertz Rental" : "e.g., Delta Flight 1234"}
              className="input-magical"
            />
          </div>

          {/* All Day Checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">All day event</span>
          </label>

          {/* Date/Time Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start {isAllDay ? "Date" : "Date & Time"} *
              </label>
              <DatePicker
                selected={startDateTime}
                onChange={(date: Date | null) => setStartDateTime(date)}
                showTimeSelect={!isAllDay}
                timeFormat="h:mm aa"
                timeIntervals={15}
                dateFormat={isAllDay ? "MMM d, yyyy" : "MMM d, yyyy h:mm aa"}
                className="input-magical w-full"
                placeholderText={isAllDay ? "Select date" : "Select date & time"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End {isAllDay ? "Date" : "Date & Time"} *
              </label>
              <DatePicker
                selected={endDateTime}
                onChange={(date: Date | null) => setEndDateTime(date)}
                showTimeSelect={!isAllDay}
                timeFormat="h:mm aa"
                timeIntervals={15}
                dateFormat={isAllDay ? "MMM d, yyyy" : "MMM d, yyyy h:mm aa"}
                className="input-magical w-full"
                placeholderText={isAllDay ? "Select date" : "Select date & time"}
                minDate={startDateTime || undefined}
              />
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., 4401 Floridian Way"
              className="input-magical"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirmation Number
            </label>
            <input
              type="text"
              value={confirmationNumber}
              onChange={(e) => setConfirmationNumber(e.target.value)}
              placeholder="e.g., ABC123"
              className="input-magical"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
              className="input-magical resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-magical flex-1 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Add Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
