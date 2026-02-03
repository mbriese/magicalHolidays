"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddReservationModal from "@/components/modals/AddReservationModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { formatDateRange } from "@/lib/formatters";
import {
  reservationTypeConfig,
  type ReservationType,
  type ReservationApiResponse,
  type TripApiResponse,
} from "@/types";

// Extended trip interface with reservations array
interface TripWithReservations extends TripApiResponse {
  reservations: ReservationApiResponse[];
}

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<TripWithReservations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reservation modal state
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [defaultReservationType, setDefaultReservationType] = useState<ReservationType | undefined>();
  const [editingReservation, setEditingReservation] = useState<ReservationApiResponse | null>(null);

  // Delete reservation state
  const [deleteReservation, setDeleteReservation] = useState<ReservationApiResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`);
      if (response.ok) {
        const data = await response.json();
        setTrip(data);
      } else {
        setError("Trip not found");
      }
    } catch (err) {
      console.error("Error fetching trip:", err);
      setError("Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  const formatReservationDate = (dateStr: string, showTime: boolean = true) => {
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!showTime) return dateFormatted;
    const timeFormatted = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${dateFormatted} at ${timeFormatted}`;
  };

  const handleAddReservation = (type?: ReservationType) => {
    setDefaultReservationType(type);
    setEditingReservation(null);
    setIsReservationModalOpen(true);
  };

  const handleEditReservation = (reservation: ReservationApiResponse) => {
    setEditingReservation(reservation);
    setDefaultReservationType(undefined);
    setIsReservationModalOpen(true);
  };

  const handleDeleteClick = (reservation: ReservationApiResponse) => {
    setDeleteReservation(reservation);
  };

  const handleConfirmDelete = async () => {
    if (!deleteReservation) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/reservations/${deleteReservation.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteReservation(null);
        fetchTrip();
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReservationSuccess = () => {
    fetchTrip();
  };

  const handleModalClose = () => {
    setIsReservationModalOpen(false);
    setEditingReservation(null);
    setDefaultReservationType(undefined);
  };

  // Group reservations by type
  const getReservationsByType = (type: ReservationType) => {
    return trip?.reservations.filter((r) => r.type === type) || [];
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="bg-linear-to-r from-[#1F2A44] to-[#344262] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-[#FFB957]/50 rounded mb-4" />
              <div className="h-8 w-64 bg-[#FFB957]/50 rounded mb-2" />
              <div className="h-4 w-48 bg-[#FFB957]/50 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="text-6xl mb-6 block">😕</span>
          <h1 className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-white mb-3">
            {error || "Trip not found"}
          </h1>
          <a href="/trips" className="btn-magical">
            Back to Trips
          </a>
        </div>
      </div>
    );
  }

  const hotelReservations = getReservationsByType("HOTEL");
  const parkReservations = getReservationsByType("PARK");
  const rideReservations = getReservationsByType("RIDE");
  const flightReservations = getReservationsByType("FLIGHT");
  const carReservations = getReservationsByType("CAR");

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-[#1F2A44] to-[#344262] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/trips"
            className="text-[#BDBDBD] hover:text-[#FFB957] text-sm mb-2 inline-block"
          >
            ← Back to Trips
          </a>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            {trip.name}
          </h1>
          <p className="text-[#FFB957] mb-1">{trip.destination}</p>
          <p className="text-[#E5E5E5] text-sm">
            {formatDateRange(trip.startDate, trip.endDate, { includeWeekday: true })}
          </p>
          {trip.budgetEnabled && trip.budgetAmount && (
            <p className="text-[#E5E5E5] text-sm mt-2">
              💰 Budget: ${trip.budgetAmount.toLocaleString()}
            </p>
          )}
          {trip.guests && trip.guests.length > 0 && (
            <div className="mt-3">
              <p className="text-[#E5E5E5] text-sm mb-1">👥 Travelers:</p>
              <div className="flex flex-wrap gap-2">
                {trip.guests.map((guest) => (
                  <span
                    key={guest}
                    className="inline-block px-2 py-1 bg-[#FFB957]/20 text-[#FFB957] rounded-full text-xs"
                  >
                    {guest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-magical p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{hotelReservations.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Hotel</div>
          </div>
          <div className="card-magical p-4 text-center">
            <div className="text-2xl font-bold text-[#1F2A44]">{parkReservations.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Park Days</div>
          </div>
          <div className="card-magical p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{rideReservations.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Rides</div>
          </div>
          <div className="card-magical p-4 text-center">
            <div className="text-2xl font-bold text-sky-600">{flightReservations.length + carReservations.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Transportation</div>
          </div>
        </div>

        {/* Hotel Section */}
        <ReservationSection
          type="HOTEL"
          reservations={hotelReservations}
          onAdd={() => handleAddReservation("HOTEL")}
          onEdit={handleEditReservation}
          onDelete={handleDeleteClick}
          formatDate={formatReservationDate}
          emptyMessage="No hotel booked yet. Where will you stay?"
        />

        {/* Parks Section */}
        <ReservationSection
          type="PARK"
          reservations={parkReservations}
          onAdd={() => handleAddReservation("PARK")}
          onEdit={handleEditReservation}
          onDelete={handleDeleteClick}
          formatDate={formatReservationDate}
          emptyMessage="No park days planned yet. Which parks will you visit?"
        />

        {/* Rides Section */}
        <ReservationSection
          type="RIDE"
          reservations={rideReservations}
          onAdd={() => handleAddReservation("RIDE")}
          onEdit={handleEditReservation}
          onDelete={handleDeleteClick}
          formatDate={formatReservationDate}
          emptyMessage="No ride reservations yet. What attractions do you want to experience?"
        />

        {/* Flights Section */}
        <ReservationSection
          type="FLIGHT"
          reservations={flightReservations}
          onAdd={() => handleAddReservation("FLIGHT")}
          onEdit={handleEditReservation}
          onDelete={handleDeleteClick}
          formatDate={formatReservationDate}
          emptyMessage="No flights booked yet. How will you get there?"
        />

        {/* Car Rental Section */}
        <ReservationSection
          type="CAR"
          reservations={carReservations}
          onAdd={() => handleAddReservation("CAR")}
          onEdit={handleEditReservation}
          onDelete={handleDeleteClick}
          formatDate={formatReservationDate}
          emptyMessage="No car rental booked yet. Will you need a vehicle?"
        />

        {/* Trip Notes */}
        {trip.notes && (
          <div className="mt-8 p-6 bg-[#FAF4EF] dark:bg-[#1F2A44]/20 rounded-xl">
            <h3 className="font-semibold text-[#1F2A44] dark:text-[#FAF4EF] mb-2">
              📝 Trip Notes
            </h3>
            <p className="text-slate-600 dark:text-slate-400">{trip.notes}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Reservation Modal */}
      <AddReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleModalClose}
        onSuccess={handleReservationSuccess}
        editReservation={editingReservation}
        defaultTripId={tripId}
        defaultType={defaultReservationType}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteReservation}
        onClose={() => setDeleteReservation(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Reservation"
        message={`Are you sure you want to delete "${deleteReservation?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

// Reservation Section Component
interface ReservationSectionProps {
  type: ReservationType;
  reservations: ReservationApiResponse[];
  onAdd: () => void;
  onEdit: (reservation: ReservationApiResponse) => void;
  onDelete: (reservation: ReservationApiResponse) => void;
  formatDate: (date: string, showTime?: boolean) => string;
  emptyMessage: string;
}

function ReservationSection({
  type,
  reservations,
  onAdd,
  onEdit,
  onDelete,
  formatDate,
  emptyMessage,
}: ReservationSectionProps) {
  const config = reservationTypeConfig[type];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-white flex items-center gap-2">
          <span>{config.icon}</span>
          {config.label}
        </h2>
        <button
          onClick={onAdd}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${config.bgColor} ${config.color} hover:opacity-80`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add {config.label}
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className={`p-6 rounded-xl border-2 border-dashed ${config.bgColor} border-opacity-50`}>
          <p className="text-center text-slate-500 dark:text-slate-400">
            {emptyMessage}
          </p>
          <div className="text-center mt-3">
            <button
              onClick={onAdd}
              className={`text-sm font-medium ${config.color} hover:underline`}
            >
              + Add your first {config.label.toLowerCase()}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations
            .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
            .map((reservation) => (
              <div
                key={reservation.id}
                className="card-magical p-4 flex items-center gap-4 group"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${config.bgColor}`}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1F2A44] dark:text-white truncate">
                    {reservation.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {formatDate(reservation.startDateTime, type !== "HOTEL")}
                  </p>
                  {reservation.location && (
                    <p className="text-sm text-slate-500 dark:text-slate-500 truncate">
                      📍 {reservation.location}
                    </p>
                  )}
                  {reservation.guests && reservation.guests.length > 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-500 truncate">
                      👥 {reservation.guests.join(", ")}
                    </p>
                  )}
                </div>
                {reservation.confirmationNumber && (
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-500">Conf #</span>
                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                      {reservation.confirmationNumber}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(reservation)}
                    className="p-2 text-slate-400 hover:text-[#1F2A44] hover:bg-[#FAF4EF] dark:hover:bg-[#1F2A44]/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(reservation)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
