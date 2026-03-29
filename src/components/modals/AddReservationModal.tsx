"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { reservationLabels, type ReservationType, type ReservationApiResponse, type TripApiResponse } from "@/types";
import { DESTINATIONS, DESTINATION_PARKS, RESERVATION_TYPES } from "@/lib/constants";
import { allAttractions } from "@/data/attractions";
import { StatusMessage } from "@/components/StatusMessage";
import { GuestListInput } from "@/components/GuestListInput";
import { parseLocalDate } from "@/lib/formatters";

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: (reservation: ReservationApiResponse) => void;
  editReservation?: ReservationApiResponse | null;
  defaultTripId?: string | null;
  defaultType?: ReservationType;
  defaultStartDate?: Date;
  defaultParkName?: string;
}

// Simplified trip type for the dropdown
interface TripOption {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}

const CREATE_TRIP_VALUE = "__create__";

export default function AddReservationModal({
  isOpen,
  onClose,
  onSuccess,
  onDelete,
  editReservation,
  defaultTripId,
  defaultType,
  defaultStartDate,
  defaultParkName,
}: AddReservationModalProps) {
  const router = useRouter();
  const isEditMode = !!editReservation;

  // Trip selection: one of none | existing | new (radio)
  type TripChoice = "none" | "existing" | "new";
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [tripChoice, setTripChoice] = useState<TripChoice>("none");
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [loadingTrips, setLoadingTrips] = useState(true);

  // New trip fields
  const [newTripName, setNewTripName] = useState("");
  const [newTripDestination, setNewTripDestination] = useState("");
  const [newTripStartDate, setNewTripStartDate] = useState<Date | null>(null);
  const [newTripEndDate, setNewTripEndDate] = useState<Date | null>(null);
  const [newTripGuests, setNewTripGuests] = useState<string[]>([]);

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
  const [showGuests, setShowGuests] = useState(false);

  // Attraction selection for RIDE type
  const [selectedAttractionId, setSelectedAttractionId] = useState<string>("");
  const [selectedPark, setSelectedPark] = useState<string>("");
  const [useCustomTitle, setUseCustomTitle] = useState(false);

  // Get the selected trip's destination
  const selectedTrip = useMemo(() => {
    return trips.find((t) => t.id === selectedTripId);
  }, [trips, selectedTripId]);

  // Set default dates: prefer defaultStartDate (from park card), else trip start
  useEffect(() => {
    if (!isOpen || editReservation || startDateTime) return;

    if (defaultStartDate) {
      const start = new Date(defaultStartDate);
      start.setHours(9, 0, 0, 0);
      setStartDateTime(start);
      const end = new Date(start);
      end.setHours(10, 0, 0, 0);
      setEndDateTime(end);
    } else if (selectedTrip) {
      const tripStartDate = parseLocalDate(selectedTrip.startDate);
      tripStartDate.setHours(9, 0, 0, 0);
      setStartDateTime(tripStartDate);
      const defaultEndDate = new Date(tripStartDate);
      defaultEndDate.setHours(10, 0, 0, 0);
      setEndDateTime(defaultEndDate);
    }
  }, [isOpen, selectedTrip, editReservation, startDateTime, defaultStartDate]);

  // Get available parks for the destination
  const availableParks = useMemo(() => {
    if (!selectedTrip) return [];
    return DESTINATION_PARKS[selectedTrip.destination] || [];
  }, [selectedTrip]);

  // Auto-select park when opened from a park card's "Add Ride" button
  useEffect(() => {
    if (!isOpen || !defaultParkName || editReservation || selectedPark) return;
    const match = availableParks.find(
      (p) => p.toLowerCase() === defaultParkName.toLowerCase()
    );
    if (match) {
      setSelectedPark(match);
    }
  }, [isOpen, defaultParkName, availableParks, editReservation, selectedPark]);

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
      setLocation(attraction.location ? `${attraction.park} - ${attraction.location}` : attraction.park);
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
        setTripChoice("existing");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editReservation, defaultTripId]);

  const populateEditForm = (reservation: ReservationApiResponse) => {
    const hasTrip = !!reservation.tripId;
    setTripChoice(hasTrip ? "existing" : "none");
    setSelectedTripId(reservation.tripId || "");
    setType(reservation.type);
    setTitle(reservation.title);
    setStartDateTime(new Date(reservation.startDateTime));
    setEndDateTime(new Date(reservation.endDateTime));
    setLocation(reservation.location || "");
    setConfirmationNumber(reservation.confirmationNumber || "");
    setNotes(reservation.notes || "");
    setGuests(reservation.guests || []);
    setShowGuests((reservation.guests || []).length > 0);
  };

  const fetchTrips = async () => {
    setLoadingTrips(true);
    try {
      const response = await fetch("/api/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
        if (data.length === 0) {
          setSelectedTripId("");
          setTripChoice("none");
        } else if (defaultTripId) {
          setSelectedTripId(defaultTripId);
          setTripChoice("existing");
        } else {
          setSelectedTripId("");
          setTripChoice("none");
        }
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleTripChoiceChange = (choice: TripChoice) => {
    setTripChoice(choice);
    if (choice === "existing" && trips.length > 0 && !selectedTripId) setSelectedTripId(trips[0].id);
    if (choice !== "existing") setSelectedTripId("");
  };

  const handleTripDropdownChange = (value: string) => {
    if (value === CREATE_TRIP_VALUE) {
      onClose();
      router.push("/trips/new");
      return;
    }
    setSelectedTripId(value);
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
      let tripId: string | null = null;
      if (tripChoice === "new") {
        tripId = null; // set after create
      } else if (tripChoice === "existing" && selectedTripId) {
        tripId = selectedTripId;
      }

      if (tripChoice === "new") {
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

      if (!title || !startDateTime || !endDateTime) {
        setError("Please fill in reservation title and dates");
        setIsLoading(false);
        return;
      }

      if (tripChoice === "existing" && !selectedTripId) {
        setError("Please select a trip to associate with.");
        setIsLoading(false);
        return;
      }

      const reservationData = {
        tripId: tripId || undefined,
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
      setTripChoice("existing");
    } else {
      setSelectedTripId("");
      setTripChoice("none");
    }
    setNewTripName("");
    setNewTripDestination("");
    setNewTripStartDate(null);
    setNewTripEndDate(null);
    setNewTripGuests([]);
    setType(defaultType || "PARK");
    setTitle("");
    setStartDateTime(null);
    setEndDateTime(null);
    setIsAllDay(false);
    setLocation("");
    setConfirmationNumber("");
    setNotes("");
    setGuests([]);
    setShowGuests(false);
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
          <h2 className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-white">
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

        {error && <div className="mb-4"><StatusMessage message={error} isError /></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trip association: radio buttons */}
          {!isEditMode && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link to a trip</p>
              {loadingTrips ? (
                <div className="text-slate-500">Loading trips...</div>
              ) : trips.length === 0 ? (
                <div className="space-y-2" role="radiogroup" aria-label="Link to a trip">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tripChoice"
                      checked={tripChoice === "none"}
                      onChange={() => handleTripChoiceChange("none")}
                      className="border-[#c4bdb5] dark:border-slate-500 text-[#1F2A44] focus:ring-[#FFB957]"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Add to calendar only (no trip)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tripChoice"
                      checked={tripChoice === "new"}
                      onChange={() => handleTripChoiceChange("new")}
                      className="border-[#c4bdb5] dark:border-slate-500 text-[#1F2A44] focus:ring-[#FFB957]"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Create A New Trip</span>
                  </label>
                </div>
              ) : (
                <div className="space-y-2" role="radiogroup" aria-label="Link to a trip">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tripChoice"
                      checked={tripChoice === "none"}
                      onChange={() => handleTripChoiceChange("none")}
                      className="border-[#c4bdb5] dark:border-slate-500 text-[#1F2A44] focus:ring-[#FFB957]"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Add to calendar only (no trip)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tripChoice"
                      checked={tripChoice === "existing"}
                      onChange={() => handleTripChoiceChange("existing")}
                      className="border-[#c4bdb5] dark:border-slate-500 text-[#1F2A44] focus:ring-[#FFB957]"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Associate with an existing trip</span>
                  </label>
                  {tripChoice === "existing" && (
                    <select
                      value={selectedTripId}
                      onChange={(e) => handleTripDropdownChange(e.target.value)}
                      className="input-magical ml-6 max-w-full block"
                    >
                      <option value="">Select a trip...</option>
                      <option value={CREATE_TRIP_VALUE}>Click here to create a new trip</option>
                      {trips.map((trip) => (
                        <option key={trip.id} value={trip.id}>
                          {trip.name} ({trip.destination})
                        </option>
                      ))}
                    </select>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tripChoice"
                      checked={tripChoice === "new"}
                      onChange={() => handleTripChoiceChange("new")}
                      className="border-[#c4bdb5] dark:border-slate-500 text-[#1F2A44] focus:ring-[#FFB957]"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Create A New Trip</span>
                  </label>
                </div>
              )}
            </div>
          )}
          {isEditMode && editReservation?.tripId && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Linked to trip: {editReservation.trip?.name ?? "—"}
            </p>
          )}

          {/* New Trip Fields */}
          {tripChoice === "new" && (
            <div className="p-4 bg-[#FAF4EF] dark:bg-[#1F2A44]/20 rounded-lg space-y-3">
              <h3 className="font-medium text-[#1F2A44] dark:text-[#E5E5E5]">New Trip Details</h3>
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
              <GuestListInput
                guests={newTripGuests}
                onAdd={(name) => { setNewTripGuests([...newTripGuests, name]); }}
                onRemove={(name) => { setNewTripGuests(newTripGuests.filter((g) => g !== name)); }}
                placeholder="Add guest name..."
                label="👥 Who's Going?"
                compact
              />
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
              {RESERVATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {reservationLabels[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Park Name Selector - for PARK type with supported destinations */}
          {type === "PARK" && availableParks.length > 0 && !useCustomTitle && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Park *
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
              <button
                type="button"
                onClick={() => setUseCustomTitle(true)}
                className="text-sm text-[#1F2A44] dark:text-[#FFB957] hover:underline"
              >
                Or enter a custom park name...
              </button>
            </>
          )}

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
                className="text-sm text-[#1F2A44] dark:text-[#FFB957] hover:underline"
              >
                Or enter a custom ride name...
              </button>
            </>
          )}

          {/* Title - shown when not using a dropdown selector, or in custom mode */}
          {((type !== "RIDE" && type !== "PARK") || useCustomTitle || availableParks.length === 0) && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title *
                {(type === "RIDE" || type === "PARK") && useCustomTitle && (
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomTitle(false);
                      setTitle("");
                      setLocation("");
                    }}
                    className="ml-2 text-xs text-[#1F2A44] dark:text-[#FFB957] hover:underline"
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
          {selectedTrip && tripChoice === "existing" && (
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded-lg">
              📅 Trip dates: {parseLocalDate(selectedTrip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {parseLocalDate(selectedTrip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          )}

          {/* All Day Checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="w-4 h-4 rounded border-[#E5E5E5] text-[#1F2A44] focus:ring-[#FFB957]"
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
                onChange={(date: Date | null) => {
                  setStartDateTime(date);
                  if (date && endDateTime && date >= endDateTime) {
                    const newEnd = new Date(date);
                    newEnd.setHours(newEnd.getHours() + 1);
                    setEndDateTime(newEnd);
                  }
                }}
                showTimeSelect={!isAllDay}
                timeFormat="h:mm aa"
                timeIntervals={15}
                dateFormat={isAllDay ? "MMM d, yyyy" : "MMM d, yyyy h:mm aa"}
                className="input-magical w-full"
                placeholderText={isAllDay ? "Select date" : "Select date & time"}
                openToDate={selectedTrip ? parseLocalDate(selectedTrip.startDate) : undefined}
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
                openToDate={startDateTime || (selectedTrip ? parseLocalDate(selectedTrip.startDate) : undefined)}
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

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={guests.length > 0 || showGuests}
                onChange={(e) => {
                  setShowGuests(e.target.checked);
                  if (!e.target.checked) setGuests([]);
                }}
                className="w-4 h-4 rounded border-slate-300 text-[#1F2A44] focus:ring-[#FFB957]"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Add Guests
              </span>
            </label>
            {(showGuests || guests.length > 0) && (
              <div className="mt-2">
                <GuestListInput
                  guests={guests}
                  onAdd={(name) => { if (!guests.includes(name)) setGuests([...guests, name]); }}
                  onRemove={(name) => { setGuests(guests.filter((g) => g !== name)); }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {isEditMode && onDelete && editReservation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(editReservation);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
              >
                Delete
              </button>
            )}
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

