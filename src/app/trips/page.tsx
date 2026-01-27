"use client";

import { useState, useEffect } from "react";
import type { Trip } from "@/types";

// Demo trips for display - using static dates to avoid hydration mismatch
const demoTrips: (Trip & { memberCount: number; reservationCount: number })[] = [
  {
    id: "1",
    name: "Summer Magic 2026",
    destination: "Walt Disney World",
    startDate: new Date("2026-07-15T00:00:00"),
    endDate: new Date("2026-07-22T00:00:00"),
    notes: "Family vacation - need to book dining reservations!",
    ownerId: "user1",
    createdAt: new Date("2026-01-01T00:00:00"),
    memberCount: 4,
    reservationCount: 12,
  },
  {
    id: "2",
    name: "Halloween Spooktacular",
    destination: "Disneyland Resort",
    startDate: new Date("2026-10-28T00:00:00"),
    endDate: new Date("2026-11-01T00:00:00"),
    notes: "Mickey's Not-So-Scary Halloween Party tickets needed",
    ownerId: "user1",
    createdAt: new Date("2026-01-01T00:00:00"),
    memberCount: 2,
    reservationCount: 8,
  },
];

export default function TripsPage() {
  const [trips] = useState(demoTrips);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-purple-600 to-purple-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                My Trips ✨
              </h1>
              <p className="text-purple-100">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const daysUntil = mounted ? getDaysUntil(trip.startDate) : 0;
              const isPast = mounted ? daysUntil < 0 : false;
              const isOngoing = mounted
                ? daysUntil <= 0 && getDaysUntil(trip.endDate) >= 0
                : false;

              return (
                <a
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="card-magical p-6 hover:scale-[1.02] transition-transform"
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isOngoing
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : isPast
                          ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
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
                  <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-1">
                    {trip.name}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">
                    {trip.destination}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                      <span>👥</span>
                      <span>{trip.memberCount} travelers</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                      <span>📋</span>
                      <span>{trip.reservationCount} reservations</span>
                    </div>
                  </div>

                  {/* Notes Preview */}
                  {trip.notes && (
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-500 line-clamp-2 italic">
                      &ldquo;{trip.notes}&rdquo;
                    </p>
                  )}
                </a>
              );
            })}

            {/* Add New Trip Card */}
            <a
              href="/trips/new"
              className="card-magical p-6 border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 flex flex-col items-center justify-center min-h-[250px] transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <span className="text-3xl">+</span>
              </div>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                Plan a New Adventure
              </span>
            </a>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <span className="text-6xl mb-6 block">🗺️</span>
            <h2 className="font-serif text-2xl font-bold text-purple-900 dark:text-white mb-3">
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
    </div>
  );
}
