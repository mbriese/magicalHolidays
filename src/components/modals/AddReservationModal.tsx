"use client";

import { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { reservationLabels, type ReservationType, type ReservationApiResponse, type TripApiResponse } from "@/types";
import { DESTINATIONS, DESTINATION_PARKS } from "@/lib/constants";
import { allAttractions } from "@/data/attractions";

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editReservation?: ReservationApiResponse | null;
  defaultTripId?: string | null;
  defaultType?: ReservationType;
}

// Simplified trip type for the dropdown
interface TripOption {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}

const reservationTypes: ReservationType[] = ["PARK", "RIDE", "HOTEL", "CAR", "FLIGHT"];

export default function AddReservationModal({
  isOpen,
  onClose,
  onSuccess,
  editReservation,
  defaultTripId,
  defaultType,
}: AddReservationModalProps) {
  const isEditMode = !!editReservation;

  // Trip selection
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // New trip fields
  const [newTripName, setNewTripName] = useState("");
  const [newTripDestination, setNewTripDestination] = useState("");
  const [newTripStartDate, setNewTripStartDate] = useState<Date | null>(null);
  const [newTripEndDate, setNewTripEndDate] = useState<Date | null>(null);
  const [newTripGuests, setNewTripGuests] = useState<string[]>([]);
  const [newTripGuestName, setNewTripGuestName] = useState("");

  // New trip guest management
  const handleAddTripGuest = () => {
    const trimmedName = newTripGuestName.trim();
    if (trimmedName && !newTripGuests.includes(trimmedName)) {
      setNewTripGuests([...newTripGuests, trimmedName]);
      setNewTripGuestName("");
    }
  };

  const handleRemoveTripGuest = (guestToRemove: string) => {
    setNewTripGuests(newTripGuests.filter((g) => g !== guestToRemove));
  };

  const handleTripGuestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTripGuest();
    }
  };

  // Reservation fields
  const [type, setType] = useState<ReservationType>("PARK");
  const [title, setTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [guests, setGuests] = useState<string[]>([]);
  const [newGuestName, setNewGuestName] = useState("");

  // Attraction selection for RIDE type
  const [selectedAttractionId, setSelectedAttractionId] = useState<string>("");
  const [selectedPark, setSelectedPark] = useState<string>("");
  const [useCustomTitle, setUseCustomTitle] = useState(false);

  // Get the selected trip's destination
  const selectedTrip = useMemo(() => {
    return trips.find((t) => t.id === selectedTripId);
  }, [trips, selectedTripId]);

  // Set default dates to trip start date when trip is selected (not in edit mode)
  useEffect(() => {
    if (selectedTrip && !editReservation && !startDateTime) {
      const tripStartDate = new Date(selectedTrip.startDate);
      // Set to 9:00 AM on the trip start date as a reasonable default
      tripStartDate.setHours(9, 0, 0, 0);
      setStartDateTime(tripStartDate);
      
      // Set end time to 10:00 AM (1 hour later) as default
      const defaultEndDate = new Date(tripStartDate);
      defaultEndDate.setHours(10, 0, 0, 0);
      setEndDateTime(defaultEndDate);
    }
  }, [selectedTrip, editReservation, startDateTime]);

  // Get available parks for the destination
  const availableParks = useMemo(() => {
    if (!selectedTrip) return [];
    return DESTINATION_PARKS[selectedTrip.destination] || [];
  }, [selectedTrip]);

  // Get attractions for the selected park
  const availableAttractions = useMemo(() => {
    if (!selectedPark) return [];
    return allAttractions.filter((a) => a.park === selectedPark);
  }, [selectedPark]);

  // Handle attraction selection
  const handleAttractionSelect = (attractionId: string) => {
    setSelectedAttractionId(attractionId);
    const attraction = allAttractions.find((a) => a.id === attractionId);
    if (attraction) {
      setTitle(attraction.name);
      setLocation(attraction.location);
    }
  };

  // Handle park change
  const handleParkChange = (park: string) => {
    setSelectedPark(park);
    setSelectedAttractionId("");
    if (!useCustomTitle) {
      setTitle("");
      setLocation("");
    }
  };

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch trips on mount and populate form in edit mode
  useEffect(() => {
    if (isOpen) {
      fetchTrips();
      if (editReservation) {
        populateEditForm(editReservation);
      } else if (defaultTripId) {
        // Set the default trip when modal opens (not in edit mode)
        setSelectedTripId(defaultTripId);
        setIsCreatingTrip(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editReservation, defaultTripId]);

  const populateEditForm = (reservation: ReservationApiResponse) => {
    setSelectedTripId(reservation.tripId);
    setType(reservation.type);
    setTitle(reservation.title);
    setStartDateTime(new Date(reservation.startDateTime));
    setEndDateTime(new Date(reservation.endDateTime));
    setLocation(reservation.location || "");
    setConfirmationNumber(reservation.confirmationNumber || "");
    setNotes(reservation.notes || "");
    setGuests(reservation.guests || []);
    setIsCreatingTrip(false);
  };

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

  const fetchTrips = async () => {
    setLoadingTrips(true);
    try {
      const response = await fetch("/api/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
        if (data.length === 0) {
          setIsCreatingTrip(true);
        } else if (defaultTripId) {
          // Use the provided default trip ID if available
          setSelectedTripId(defaultTripId);
          setIsCreatingTrip(false);
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
          guests: newTripGuests,
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

      const reservationData = {
        tripId,
        type,
        title,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        location: location || null,
        confirmationNumber: confirmationNumber || null,
        notes: notes || null,
        guests: guests,
        guestCount: guests.length > 0 ? guests.length : null,
      };

      // Create or update reservation
      const url = isEditMode
        ? `/api/reservations/${editReservation.id}`
        : "/api/reservations";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        // Reset form
        resetForm();
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || `Failed to ${isEditMode ? "update" : "create"} reservation`);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (defaultTripId) {
      setSelectedTripId(defaultTripId);
      setIsCreatingTrip(false);
    } else {
      setSelectedTripId(trips.length > 0 ? trips[0].id : "");
      setIsCreatingTrip(trips.length === 0);
    }
    setNewTripName("");
    setNewTripDestination("");
    setNewTripStartDate(null);
    setNewTripEndDate(null);
    setNewTripGuests([]);
    setNewTripGuestName("");
    setType(defaultType || "PARK");
    setTitle("");
    setStartDateTime(null);
    setEndDateTime(null);
    setIsAllDay(false);
    setLocation("");
    setConfirmationNumber("");
    setNotes("");
    setGuests([]);
    setNewGuestName("");
    setError("");
    // Reset attraction selection
    setSelectedAttractionId("");
    setSelectedPark("");
    setUseCustomTitle(false);
  };

  // Set default type when modal opens with a default type
  useEffect(() => {
    if (isOpen && defaultType && !editReservation) {
      setType(defaultType);
    }
  }, [isOpen, defaultType, editReservation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6 my-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-serif text-2xl font-bold text-purple-900 dark:text-white">
            {isEditMode ? "Edit Reservation ✏️" : "Add Reservation ✨"}
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
                disabled={isEditMode}
              >
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name} ({trip.destination})
                  </option>
                ))}
                {!isEditMode && <option value="new">+ Create New Trip</option>}
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
                {DESTINATIONS.map((dest) => (
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
              {/* Trip Guests */}
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">👥 Who&apos;s Going?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTripGuestName}
                    onChange={(e) => setNewTripGuestName(e.target.value)}
                    onKeyDown={handleTripGuestKeyDown}
                    placeholder="Add guest name..."
                    className="input-magical flex-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTripGuest}
                    disabled={!newTripGuestName.trim()}
                    className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-300 dark:hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>
                {newTripGuests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newTripGuests.map((guest) => (
                      <span
                        key={guest}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs"
                      >
                        {guest}
                        <button
                          type="button"
                          onClick={() => handleRemoveTripGuest(guest)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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

          {/* Ride/Attraction Selector - only for RIDE type with supported destinations */}
          {type === "RIDE" && availableParks.length > 0 && !useCustomTitle && (
            <>
              {/* Park Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Park *
                </label>
                <select
                  value={selectedPark}
                  onChange={(e) => handleParkChange(e.target.value)}
                  className="input-magical"
                >
                  <option value="">Choose a park...</option>
                  {availableParks.map((park) => (
                    <option key={park} value={park}>
                      {park}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attraction Selector */}
              {selectedPark && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Ride/Attraction *
                  </label>
                  <select
                    value={selectedAttractionId}
                    onChange={(e) => handleAttractionSelect(e.target.value)}
                    className="input-magical"
                  >
                    <option value="">Choose an attraction...</option>
                    {availableAttractions.map((attraction) => (
                      <option key={attraction.id} value={attraction.id}>
                        {attraction.icon} {attraction.name}
                      </option>
                    ))}
                  </select>
                  {selectedAttractionId && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {allAttractions.find((a) => a.id === selectedAttractionId)?.tips}
                    </p>
                  )}
                </div>
              )}

              {/* Option to enter custom */}
              <button
                type="button"
                onClick={() => setUseCustomTitle(true)}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Or enter a custom ride name...
              </button>
            </>
          )}

          {/* Title - shown for non-RIDE types, or when using custom title, or unsupported destinations */}
          {(type !== "RIDE" || useCustomTitle || availableParks.length === 0) && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title *
                {type === "RIDE" && useCustomTitle && (
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomTitle(false);
                      setTitle("");
                      setLocation("");
                    }}
                    className="ml-2 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    (Select from list instead)
                  </button>
                )}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === "PARK" ? "e.g., Magic Kingdom" : type === "RIDE" ? "e.g., Space Mountain Lightning Lane" : type === "HOTEL" ? "e.g., Grand Floridian" : type === "CAR" ? "e.g., Hertz Rental" : "e.g., Delta Flight 1234"}
                className="input-magical"
              />
            </div>
          )}

          {/* Trip Date Range Hint */}
          {selectedTrip && !isCreatingTrip && (
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded-lg">
              📅 Trip dates: {new Date(selectedTrip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(selectedTrip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          )}

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
                openToDate={selectedTrip ? new Date(selectedTrip.startDate) : undefined}
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
                openToDate={startDateTime || (selectedTrip ? new Date(selectedTrip.startDate) : undefined)}
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

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Guests
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
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
            {guests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {guests.map((guest) => (
                  <span
                    key={guest}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                  >
                    👤 {guest}
                    <button
                      type="button"
                      onClick={() => handleRemoveGuest(guest)}
                      className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Press Enter or click Add to add guests
            </p>
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
              {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Add Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
