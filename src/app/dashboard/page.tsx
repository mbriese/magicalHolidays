"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import TripCalendar from "@/components/calendar/TripCalendar";
import AddReservationModal from "@/components/modals/AddReservationModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { BadgeShowcase } from "@/components/badges";
import ItineraryBuilder from "@/components/ItineraryBuilder";
import BudgetTracker from "@/components/BudgetTracker";
import type { CalendarEvent, ReservationType, BadgeWithProgress, ReservationApiResponse, TripApiResponse } from "@/types";
import { reservationClassNames, reservationColors } from "@/types";
import {
  isOnline,
  getOfflineTrips,
  getOfflineReservations,
  getOfflineBadges,
  saveTripsOffline,
  saveReservationsOffline,
  saveBadgesOffline,
} from "@/lib/offlineStorage";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const pageTitle = session?.user?.name ? `${session.user.name}'s Dashboard` : "Your Dashboard";
  const [apiSaysUnauthenticated, setApiSaysUnauthenticated] = useState(false);
  const isUnauthenticated = status === "unauthenticated" || apiSaysUnauthenticated;
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [reservations, setReservations] = useState<ReservationApiResponse[]>([]);
  const [trips, setTrips] = useState<TripApiResponse[]>([]);
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<ReservationApiResponse | null>(null);
  const {
    itemToDelete: deleteReservation,
    setItemToDelete: setDeleteReservation,
    isDeleting,
    handleConfirmDelete,
  } = useDeleteConfirmation<ReservationApiResponse>({
    endpoint: (r) => `/api/reservations/${r.id}`,
    onSuccess: () => { fetchData(); fetchBadges(); },
  });
  const [loading, setLoading] = useState(true);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [stats, setStats] = useState({
    activeTrips: 0,
    parkDays: 0,
    totalReservations: 0,
    daysUntilTrip: 0,
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    fetchBadges();
  }, []);

  // Process and set data (used by both online and offline paths)
  const processData = (tripsData: TripApiResponse[], reservationsData: ReservationApiResponse[]) => {
    setTrips(tripsData);
    setReservations(reservationsData);

    // Transform reservations to calendar events
    const calendarEvents: CalendarEvent[] = reservationsData.map((r) => ({
      id: r.id,
      title: r.title,
      start: r.startDateTime,
      end: r.endDateTime,
      className: reservationClassNames[r.type],
      extendedProps: {
        type: r.type,
        location: r.location || undefined,
        confirmationNumber: r.confirmationNumber || undefined,
        notes: r.notes || undefined,
      },
    }));

    setEvents(calendarEvents);

    // Calculate stats
    const now = new Date();
    const activeTrips = tripsData.filter(
      (t) => new Date(t.endDate) >= now
    ).length;

    const parkDays = reservationsData.filter((r) => r.type === "PARK").length;

    const upcomingTrip = tripsData
      .filter((t) => new Date(t.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

    const daysUntilTrip = upcomingTrip
      ? Math.ceil(
          (new Date(upcomingTrip.startDate).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    setStats({
      activeTrips,
      parkDays,
      totalReservations: reservationsData.length,
      daysUntilTrip,
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setIsOfflineData(false);

    try {
      if (isOnline()) {
        // Online: Fetch from API and save to offline storage
        const [tripsRes, reservationsRes] = await Promise.all([
          fetch("/api/trips"),
          fetch("/api/reservations"),
        ]);

        const isJson = (r: Response) => r.headers.get("content-type")?.includes("application/json");
        if (tripsRes.ok && reservationsRes.ok && isJson(tripsRes) && isJson(reservationsRes)) {
          const tripsData: TripApiResponse[] = await tripsRes.json();
          const reservationsData: ReservationApiResponse[] = await reservationsRes.json();

          await Promise.all([
            saveTripsOffline(tripsData),
            saveReservationsOffline(reservationsData),
          ]);

          processData(tripsData, reservationsData);
        } else if (tripsRes.status === 401 || reservationsRes.status === 401 || !isJson(tripsRes) || !isJson(reservationsRes)) {
          setApiSaysUnauthenticated(true);
          processData([], []);
          await Promise.all([saveTripsOffline([]), saveReservationsOffline([])]);
          if (tripsRes.status === 401 || reservationsRes.status === 401) {
            signOut({ redirect: false });
          }
        } else {
          throw new Error("API request failed");
        }
      } else {
        // Offline: Load from cache
        await loadOfflineData();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Try loading from offline storage as fallback
      await loadOfflineData();
    } finally {
      setLoading(false);
    }
  };

  const loadOfflineData = async () => {
    try {
      const [tripsData, reservationsData] = await Promise.all([
        getOfflineTrips<TripApiResponse>(),
        getOfflineReservations<ReservationApiResponse>(),
      ]);

      if (tripsData.length > 0 || reservationsData.length > 0) {
        setIsOfflineData(true);
        processData(tripsData, reservationsData);
      }
    } catch (error) {
      console.error("Error loading offline data:", error);
    }
  };

  const fetchBadges = async () => {
    try {
      if (isOnline()) {
        // First, check/update badge progress
        await fetch("/api/badges", { method: "POST" });

        // Then fetch badges with progress
        const res = await fetch("/api/badges");
        const isJson = res.headers.get("content-type")?.includes("application/json");
        if (res.ok && isJson) {
          const badgesData = await res.json();
          setBadges(badgesData);
          await saveBadgesOffline(badgesData);
        }
      } else {
        // Load from offline storage
        const offlineBadges = await getOfflineBadges<BadgeWithProgress>();
        if (offlineBadges.length > 0) {
          setBadges(offlineBadges);
        }
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
      // Try loading from offline storage as fallback
      const offlineBadges = await getOfflineBadges<BadgeWithProgress>();
      if (offlineBadges.length > 0) {
        setBadges(offlineBadges);
      }
    }
  };

  const handleEventClick = (eventId: string) => {
    const reservation = reservations.find((r) => r.id === eventId);
    if (reservation) {
      handleEditReservation(reservation);
    }
  };

  const handleDateSelect = (start: Date, end: Date) => {
    console.log("Date selected:", start, end);
    setEditingReservation(null);
    setIsModalOpen(true);
  };

  const handleEventDrop = (eventId: string, newStart: Date, newEnd: Date) => {
    console.log("Event moved:", eventId, newStart, newEnd);
    // TODO: Update reservation dates via API
  };

  const handleEditReservation = (reservation: ReservationApiResponse) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (reservation: ReservationApiResponse) => {
    setDeleteReservation(reservation);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingReservation(null);
  };

  const handleReservationSaved = () => {
    fetchData(); // Refresh data after adding reservation
    fetchBadges(); // Refresh badges to check for new achievements
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="relative overflow-hidden py-8 bg-starfield">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            {pageTitle} ✨
          </h1>
          <p className="text-[#E5E5E5]">
            {isUnauthenticated
              ? "Let's start planning your magical adventure!"
              : "Welcome back! Here's your upcoming magical adventure."}
          </p>
          {isUnauthenticated && (
            <p className="text-[#E5E5E5]/90 text-sm mt-1">
              Sign in to save your plans and see them across devices.
            </p>
          )}
          {isOfflineData && !isUnauthenticated && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm text-amber-100">
                Viewing cached data
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Overview & Achievements – only when signed in */}
        {!isUnauthenticated && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="section-outlined">
              <span className="section-title">Trip Overview</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="card-stat stat-midnight p-4 text-center">
                  <div className="text-3xl font-bold text-[#1F2A44] dark:text-white">
                    {loading ? "..." : stats.activeTrips}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Active {stats.activeTrips === 1 ? "Trip" : "Trips"}
                  </div>
                </div>
                <div className="card-stat stat-blue p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {loading ? "..." : stats.parkDays}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Park Days</div>
                </div>
                <div className="card-stat stat-amber p-4 text-center">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {loading ? "..." : stats.totalReservations}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Reservations</div>
                </div>
                <div className="card-stat stat-green p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {loading ? "..." : stats.daysUntilTrip || "—"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Days Until Trip</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BadgeShowcase badges={badges} />
          </div>
        </div>
        )}

        {/* Quick Actions – always show New Trip & Add Reservation; View All Trips only when we have trips */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href="/trips/new" className="btn-magical text-sm py-2 px-4">
            + New Trip
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-outline text-sm py-2 px-4"
          >
            + Add Reservation
          </button>
          {trips.length > 0 && (
          <a href="/trips" className="btn-outline text-sm py-2 px-4">
            View All Trips
          </a>
          )}
        </div>

        {/* Empty State (signed-in users with no data) */}
        {!isUnauthenticated && !loading && events.length === 0 && (
          <div className="card-magical p-12 text-center mb-8">
            <span className="text-5xl mb-4 block">📅</span>
            <h3 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-white mb-2">
              No Reservations Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Start planning your magical adventure by adding your first reservation!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-magical"
            >
              Add Your First Reservation ✨
            </button>
          </div>
        )}

        {/* Calendar – always show */}
        <div className="mb-8 section-outlined">
          <span className="section-title">Trip Calendar</span>
          <div className="pt-2">
            <TripCalendar
              events={events}
              onEventClick={handleEventClick}
              onDateSelect={handleDateSelect}
              onEventDrop={handleEventDrop}
            />
          </div>
        </div>

        {/* Itinerary Builder & Budget Tracker – only when signed in */}
        {!isUnauthenticated && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ItineraryBuilder onAddToTrip={() => { fetchData(); fetchBadges(); }} />
          <BudgetTracker onExpenseAdded={() => fetchData()} />
        </div>
        )}

        {/* Upcoming Reservations – only when signed in and has reservations */}
        {!isUnauthenticated && reservations.length > 0 && (
            <div className="section-outlined">
              <span className="section-title">Upcoming Reservations</span>
            <div className="space-y-3 pt-2">
              {reservations
                .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
                .slice(0, 5)
                .map((reservation) => (
                  <div
                    key={reservation.id}
                    className="card-magical p-4 flex items-center space-x-4 group"
                  >
                    <div
                      className="w-3 h-12 rounded-full shrink-0"
                      style={{
                        backgroundColor: reservationColors[reservation.type],
                      }}
                    />
                    <div className="grow min-w-0">
                      <h3 className="font-semibold text-[#1F2A44] dark:text-white truncate">
                        {reservation.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(reservation.startDateTime).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {reservation.confirmationNumber && (
                      <div className="text-right hidden sm:block">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Conf #
                        </span>
                        <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                          {reservation.confirmationNumber}
                        </p>
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditReservation(reservation)}
                        className="p-2 text-slate-400 hover:text-[#1F2A44] hover:bg-[#FAF4EF] dark:hover:bg-[#1F2A44]/20 rounded-lg transition-colors"
                        title="Edit reservation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(reservation)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete reservation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>

      {/* Add/Edit Reservation Modal */}
      <AddReservationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleReservationSaved}
        editReservation={editingReservation}
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

