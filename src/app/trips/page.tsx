"use client";

import { useState, useEffect } from "react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import AddReservationModal from "@/components/modals/AddReservationModal";
import EditTripModal from "@/components/modals/EditTripModal";
import { formatDateRange, getDaysUntil } from "@/lib/formatters";
import type { TripApiResponse } from "@/types";

export default function TripsPage() {
  const [trips, setTrips] = useState<TripApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Edit modal state
  const [editingTrip, setEditingTrip] = useState<TripApiResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete modal state
  const [deleteTrip, setDeleteTrip] = useState<TripApiResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add reservation modal state
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedTripForReservation, setSelectedTripForReservation] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit handlers
  const handleEditClick = (e: React.MouseEvent, trip: TripApiResponse) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingTrip(trip);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTrip(null);
  };

  const handleEditSuccess = () => {
    fetchTrips();
  };

  // Delete handlers
  const handleDeleteClick = (e: React.MouseEvent, trip: TripApiResponse) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTrip(trip);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTrip) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/trips/${deleteTrip.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteTrip(null);
        fetchTrips();
      } else {
        console.error("Failed to delete trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Add reservation handlers
  const handleAddReservationClick = (e: React.MouseEvent, tripId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTripForReservation(tripId);
    setIsReservationModalOpen(true);
  };

  const handleReservationModalClose = () => {
    setIsReservationModalOpen(false);
    setSelectedTripForReservation(null);
  };

  const handleReservationAdded = () => {
    fetchTrips(); // Refresh to update reservation counts
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        {/* Hero Image Section - Family Planning */}
        <div className="relative overflow-hidden">
          {/* Responsive Hero Image - Mobile */}
          <div 
            className="h-64 sm:hidden bg-cover bg-no-repeat"
            style={{ backgroundImage: 'url(/images/hero-trips-mobile.png)', backgroundPosition: 'center 30%' }}
          />
          {/* Responsive Hero Image - Tablet */}
          <div 
            className="h-72 hidden sm:block lg:hidden bg-cover bg-no-repeat"
            style={{ backgroundImage: 'url(/images/hero-trips-tablet.png)', backgroundPosition: 'center 30%' }}
          />
          {/* Responsive Hero Image - Desktop */}
          <div 
            className="h-96 hidden lg:block bg-cover bg-no-repeat"
            style={{ backgroundImage: 'url(/images/hero-trips-desktop.png)', backgroundPosition: 'center 30%' }}
          />
          {/* Subtle gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#1F2A44] to-transparent" />
        </div>
        
        {/* Banner Section */}
        <div className="bg-linear-to-r from-[#1F2A44] to-midnight-600 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
              My Trips ✨
            </h1>
            <p className="text-[#E5E5E5]">Loading your magical adventures...</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-trip p-6 animate-pulse">
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Image Section - Family Planning */}
      <div className="relative overflow-hidden">
        {/* Responsive Hero Image - Mobile */}
        <div 
          className="h-64 sm:hidden bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-trips-mobile.png)', backgroundPosition: 'center 30%' }}
        />
        {/* Responsive Hero Image - Tablet */}
        <div 
          className="h-72 hidden sm:block lg:hidden bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-trips-tablet.png)', backgroundPosition: 'center 30%' }}
        />
        {/* Responsive Hero Image - Desktop */}
        <div 
          className="h-96 hidden lg:block bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-trips-desktop.png)', backgroundPosition: 'center 30%' }}
        />
        {/* Subtle gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#1F2A44] to-transparent" />
      </div>
      
      {/* Banner Section */}
      <div className="bg-linear-to-r from-[#1F2A44] to-midnight-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                My Trips ✨
              </h1>
              <p className="text-[#E5E5E5]">
                Plan, organize, and track all your magical adventures
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <a href="/trips/new" className="btn-gold">
                + Create New Trip
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trips Grid */}
        {trips.length > 0 ? (
          <div className="section-outlined">
            <span className="section-title">Your Adventures</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {trips.map((trip) => {
              const daysUntil = mounted ? getDaysUntil(trip.startDate) : 0;
              const isPast = mounted ? daysUntil < 0 : false;
              const isOngoing = mounted
                ? daysUntil <= 0 && getDaysUntil(trip.endDate) >= 0
                : false;

              return (
                <div
                  key={trip.id}
                  className="card-trip p-6 group relative"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => handleAddReservationClick(e, trip.id)}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Add reservation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleEditClick(e, trip)}
                      className="p-2 text-slate-400 hover:text-[#1F2A44] hover:bg-[#FAF4EF] dark:hover:bg-[#1F2A44]/20 rounded-lg transition-colors"
                      title="Edit trip"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, trip)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete trip"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <a href={`/trips/${trip.id}`} className="block">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isOngoing
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : isPast
                            ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                            : "bg-[#1F2A44]/10 text-[#1F2A44] dark:bg-[#1F2A44]/30 dark:text-[#FFB957]"
                        }`}
                      >
                        {!mounted
                          ? "Loading..."
                          : isOngoing
                          ? "Happening Now!"
                          : isPast
                          ? "Completed"
                          : `${daysUntil} days away`}
                      </span>
                    </div>

                    {/* Trip Info */}
                    <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-white mb-1">
                      {trip.name}
                    </h3>
                    <p className="text-[#1F2A44] dark:text-[#FFB957] font-medium mb-3">
                      {trip.destination}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {formatDateRange(trip.startDate, trip.endDate, { shortFormat: true })}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                        <span>👥</span>
                        <span>{(trip._count?.members || 0) + 1} travelers</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                        <span>📋</span>
                        <span>{trip._count?.reservations || 0} reservations</span>
                      </div>
                    </div>

                    {/* Budget indicator */}
                    {trip.budgetEnabled && trip.budgetAmount && (
                      <div className="mt-3 flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
                        <span>💰</span>
                        <span>Budget: ${trip.budgetAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Notes Preview */}
                    {trip.notes && (
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-500 line-clamp-2 italic">
                        &ldquo;{trip.notes}&rdquo;
                      </p>
                    )}
                  </a>

                  {/* Add Reservation Button */}
                  <button
                    onClick={(e) => handleAddReservationClick(e, trip.id)}
                    className="mt-4 w-full py-2 px-4 text-sm font-medium text-[#1F2A44] dark:text-[#FFB957] bg-[#FAF4EF] dark:bg-[#1F2A44]/20 hover:bg-[#1F2A44]/10 dark:hover:bg-[#1F2A44]/40 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Reservation
                  </button>
                </div>
              );
            })}

            {/* Add New Trip Card */}
            <a
              href="/trips/new"
              className="card-trip p-6 border-dashed border-[#c4bdb5] dark:border-midnight-500 hover:border-[#FFB957] dark:hover:border-[#FFB957] flex flex-col items-center justify-center min-h-[250px]"
            >
              <div className="w-16 h-16 rounded-full bg-[#1F2A44]/10 dark:bg-[#1F2A44]/30 flex items-center justify-center mb-4">
                <span className="text-3xl">+</span>
              </div>
              <span className="font-medium text-[#1F2A44] dark:text-[#FFB957]">
                Plan a New Adventure
              </span>
            </a>
          </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <span className="text-6xl mb-6 block">🗺️</span>
            <h2 className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-white mb-3">
              No Trips Yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Start planning your first magical adventure! Create a trip to
              organize all your reservations in one place.
            </p>
            <a href="/trips/new" className="btn-magical">
              Create Your First Trip ✨
            </a>
          </div>
        )}
      </div>

      {/* Edit Trip Modal */}
      <EditTripModal
        isOpen={isEditModalOpen}
        trip={editingTrip}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTrip}
        onClose={() => setDeleteTrip(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Trip"
        message={`Are you sure you want to delete "${deleteTrip?.name}"? This will also delete all reservations and expenses associated with this trip. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Add Reservation Modal */}
      <AddReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleReservationModalClose}
        onSuccess={handleReservationAdded}
        defaultTripId={selectedTripForReservation}
      />
    </div>
  );
}

