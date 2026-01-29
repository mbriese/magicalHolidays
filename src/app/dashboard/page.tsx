"use client";

import { useState, useEffect } from "react";
import TripCalendar from "@/components/calendar/TripCalendar";
import AddReservationModal from "@/components/modals/AddReservationModal";
import { BadgeShowcase } from "@/components/badges";
import type { CalendarEvent, ReservationType, BadgeWithProgress } from "@/types";
import { reservationClassNames } from "@/types";
import {
  isOnline,
  getOfflineTrips,
  getOfflineReservations,
  getOfflineBadges,
  saveTripsOffline,
  saveReservationsOffline,
  saveBadgesOffline,
} from "@/lib/offlineStorage";

interface ApiReservation {
  id: string;
  type: ReservationType;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location: string | null;
  confirmationNumber: string | null;
  notes: string | null;
  trip: { name: string };
}

interface ApiTrip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  _count: {
    reservations: number;
    members: number;
  };
}

export default function DashboardPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const processData = (tripsData: ApiTrip[], reservationsData: ApiReservation[]) => {
    setTrips(tripsData);

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

        if (tripsRes.ok && reservationsRes.ok) {
          const tripsData: ApiTrip[] = await tripsRes.json();
          const reservationsData: ApiReservation[] = await reservationsRes.json();

          // Save to offline storage for later
          await Promise.all([
            saveTripsOffline(tripsData),
            saveReservationsOffline(reservationsData),
          ]);

          processData(tripsData, reservationsData);
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
        getOfflineTrips<ApiTrip>(),
        getOfflineReservations<ApiReservation>(),
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
        if (res.ok) {
          const badgesData = await res.json();
          setBadges(badgesData);
          // Save to offline storage
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
    console.log("Event clicked:", eventId);
    // TODO: Open event detail/edit modal
  };

  const handleDateSelect = (start: Date, end: Date) => {
    console.log("Date selected:", start, end);
    setIsModalOpen(true);
  };

  const handleEventDrop = (eventId: string, newStart: Date, newEnd: Date) => {
    console.log("Event moved:", eventId, newStart, newEnd);
    // TODO: Update reservation dates via API
  };

  const handleReservationAdded = () => {
    fetchData(); // Refresh data after adding reservation
    fetchBadges(); // Refresh badges to check for new achievements
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-purple-600 to-purple-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            Your Dashboard ✨
          </h1>
          <p className="text-purple-100">
            Welcome back! Here&apos;s your upcoming magical adventure.
          </p>
          {isOfflineData && (
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
        {/* Quick Stats & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-magical p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {loading ? "..." : stats.activeTrips}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Active {stats.activeTrips === 1 ? "Trip" : "Trips"}
                </div>
              </div>
              <div className="card-magical p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {loading ? "..." : stats.parkDays}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Park Days</div>
              </div>
              <div className="card-magical p-4 text-center">
                <div className="text-3xl font-bold text-amber-600">
                  {loading ? "..." : stats.totalReservations}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Reservations</div>
              </div>
              <div className="card-magical p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {loading ? "..." : stats.daysUntilTrip || "—"}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Days Until Trip</div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="lg:col-span-1">
            <BadgeShowcase badges={badges} />
          </div>
        </div>

        {/* Quick Actions */}
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
          <a href="/trips" className="btn-outline text-sm py-2 px-4">
            View All Trips
          </a>
        </div>

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="card-magical p-12 text-center mb-8">
            <span className="text-5xl mb-4 block">📅</span>
            <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-2">
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

        {/* Calendar */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-purple-900 dark:text-white mb-4">
            Trip Calendar
          </h2>
          <TripCalendar
            events={events}
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
            onEventDrop={handleEventDrop}
          />
        </div>

        {/* Upcoming Reservations List */}
        {events.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-purple-900 dark:text-white mb-4">
              Upcoming Reservations
            </h2>
            <div className="space-y-3">
              {events
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="card-magical p-4 flex items-center space-x-4"
                  >
                    <div
                      className="w-3 h-12 rounded-full"
                      style={{
                        backgroundColor:
                          event.extendedProps?.type === "PARK"
                            ? "#8b5cf6"
                            : event.extendedProps?.type === "RIDE"
                            ? "#3b82f6"
                            : event.extendedProps?.type === "HOTEL"
                            ? "#f59e0b"
                            : event.extendedProps?.type === "CAR"
                            ? "#22c55e"
                            : "#0ea5e9",
                      }}
                    />
                    <div className="grow">
                      <h3 className="font-semibold text-purple-900 dark:text-white">
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(event.start).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {event.extendedProps?.confirmationNumber && (
                      <div className="text-right">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Conf #
                        </span>
                        <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                          {event.extendedProps.confirmationNumber}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Reservation Modal */}
      <AddReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleReservationAdded}
      />
    </div>
  );
}
