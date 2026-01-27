"use client";

import { useState } from "react";
import TripCalendar from "@/components/calendar/TripCalendar";
import type { CalendarEvent } from "@/types";

// Demo events for display (will be replaced with real data)
// Using static dates to avoid hydration mismatch
const demoEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Magic Kingdom",
    start: "2026-02-15T08:00:00",
    end: "2026-02-15T22:00:00",
    extendedProps: {
      type: "PARK",
      location: "Magic Kingdom Park",
      confirmationNumber: "MK-12345",
      notes: "Rope drop at 8am!",
    },
  },
  {
    id: "2",
    title: "Space Mountain - Lightning Lane",
    start: "2026-02-15T11:00:00",
    end: "2026-02-15T12:00:00",
    extendedProps: {
      type: "RIDE",
      location: "Tomorrowland",
      notes: "Check in 5 mins early",
    },
  },
  {
    id: "3",
    title: "Grand Floridian Resort",
    start: "2026-02-14",
    end: "2026-02-19",
    allDay: true,
    extendedProps: {
      type: "HOTEL",
      location: "4401 Floridian Way",
      confirmationNumber: "GF-98765",
      notes: "Deluxe room with park view",
    },
  },
  {
    id: "4",
    title: "Flight to Orlando",
    start: "2026-02-14T06:00:00",
    end: "2026-02-14T10:00:00",
    extendedProps: {
      type: "FLIGHT",
      location: "MCO - Orlando International",
      confirmationNumber: "UA-456789",
      notes: "Delta Flight 1234",
    },
  },
  {
    id: "5",
    title: "Rental Car Pickup",
    start: "2026-02-14T10:30:00",
    end: "2026-02-19T10:00:00",
    extendedProps: {
      type: "CAR",
      location: "MCO Airport - Hertz",
      confirmationNumber: "HZ-111222",
      notes: "Midsize SUV reserved",
    },
  },
];

export default function DashboardPage() {
  const [events] = useState<CalendarEvent[]>(demoEvents);

  const handleEventClick = (eventId: string) => {
    console.log("Event clicked:", eventId);
  };

  const handleDateSelect = (start: Date, end: Date) => {
    console.log("Date selected:", start, end);
    // TODO: Open modal to create new reservation
  };

  const handleEventDrop = (eventId: string, newStart: Date, newEnd: Date) => {
    console.log("Event moved:", eventId, newStart, newEnd);
    // TODO: Update reservation dates
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-magical p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">1</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Trip</div>
          </div>
          <div className="card-magical p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">2</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Park Days</div>
          </div>
          <div className="card-magical p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">5</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Reservations</div>
          </div>
          <div className="card-magical p-4 text-center">
            <div className="text-3xl font-bold text-green-600">4</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Days Until Trip</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href="/trips/new" className="btn-magical text-sm py-2 px-4">
            + New Trip
          </a>
          <button className="btn-outline text-sm py-2 px-4">
            + Add Reservation
          </button>
          <a href="/trips" className="btn-outline text-sm py-2 px-4">
            View All Trips
          </a>
        </div>

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
      </div>
    </div>
  );
}
