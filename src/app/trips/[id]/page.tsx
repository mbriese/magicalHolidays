"use client";

import { useState } from "react";
import TripCalendar from "@/components/calendar/TripCalendar";
import type { CalendarEvent, Trip } from "@/types";

// Demo data - using static dates to avoid hydration mismatch
const demoTrip: Trip = {
  id: "1",
  name: "Summer Magic 2026",
  destination: "Walt Disney World",
  startDate: new Date("2026-07-15T00:00:00"),
  endDate: new Date("2026-07-22T00:00:00"),
  notes: "Family vacation - need to book dining reservations!",
  ownerId: "user1",
  createdAt: new Date("2026-01-01T00:00:00"),
};

interface DemoMember {
  id: string;
  tripId: string;
  userId: string;
  role: "OWNER" | "MEMBER";
  joinedAt: Date;
  user: { name: string; email: string };
}

const demoMembers: DemoMember[] = [
  {
    id: "m1",
    tripId: "1",
    userId: "user1",
    role: "OWNER",
    joinedAt: new Date("2026-01-01T00:00:00"),
    user: { name: "You", email: "you@example.com" },
  },
  {
    id: "m2",
    tripId: "1",
    userId: "user2",
    role: "MEMBER",
    joinedAt: new Date("2026-01-05T00:00:00"),
    user: { name: "Sarah Smith", email: "sarah@example.com" },
  },
  {
    id: "m3",
    tripId: "1",
    userId: "user3",
    role: "MEMBER",
    joinedAt: new Date("2026-01-05T00:00:00"),
    user: { name: "Tom Johnson", email: "tom@example.com" },
  },
];

const demoEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Magic Kingdom",
    start: "2026-07-16T08:00:00",
    end: "2026-07-16T22:00:00",
    extendedProps: {
      type: "PARK",
      location: "Magic Kingdom Park",
      confirmationNumber: "MK-12345",
    },
  },
  {
    id: "2",
    title: "Space Mountain - LL",
    start: "2026-07-16T11:00:00",
    end: "2026-07-16T12:00:00",
    extendedProps: {
      type: "RIDE",
      location: "Tomorrowland",
    },
  },
  {
    id: "3",
    title: "Grand Floridian Resort",
    start: "2026-07-15",
    end: "2026-07-22",
    allDay: true,
    extendedProps: {
      type: "HOTEL",
      location: "4401 Floridian Way",
      confirmationNumber: "GF-98765",
    },
  },
  {
    id: "4",
    title: "EPCOT",
    start: "2026-07-17T09:00:00",
    end: "2026-07-17T21:00:00",
    extendedProps: {
      type: "PARK",
      location: "EPCOT",
      confirmationNumber: "EP-67890",
    },
  },
  {
    id: "5",
    title: "Flight to Orlando",
    start: "2026-07-15T06:00:00",
    end: "2026-07-15T10:00:00",
    extendedProps: {
      type: "FLIGHT",
      location: "MCO - Orlando International",
      confirmationNumber: "DL-456789",
    },
  },
];

export default function TripDetailPage() {
  const [trip] = useState(demoTrip);
  const [members] = useState(demoMembers);
  const [events] = useState<CalendarEvent[]>(demoEvents);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"calendar" | "reservations" | "members">("calendar");

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const endStr = end.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invite functionality
    console.log("Invite:", inviteEmail);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-purple-600 to-purple-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <a
                href="/trips"
                className="text-purple-200 hover:text-white text-sm mb-2 inline-block"
              >
                ← Back to Trips
              </a>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                {trip.name}
              </h1>
              <p className="text-purple-100 mb-1">{trip.destination}</p>
              <p className="text-purple-200 text-sm">
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button className="btn-gold text-sm py-2 px-4">
                + Add Reservation
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Invite Members
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-purple-100 dark:bg-slate-800 rounded-lg p-1 mb-8 max-w-md">
          {(["calendar", "reservations", "members"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-purple-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <TripCalendar
            events={events}
            onEventClick={(id) => console.log("Event clicked:", id)}
            onDateSelect={(start, end) =>
              console.log("Date selected:", start, end)
            }
          />
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-purple-900 dark:text-white">
                All Reservations
              </h2>
              <button className="btn-magical text-sm py-2 px-4">
                + Add Reservation
              </button>
            </div>
            {events.map((event) => (
              <div
                key={event.id}
                className="card-magical p-4 flex items-center space-x-4"
              >
                <div
                  className="w-3 h-16 rounded-full"
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
                    })}
                    {!event.allDay &&
                      ` at ${new Date(event.start).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}`}
                  </p>
                  {event.extendedProps?.location && (
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      📍 {event.extendedProps.location}
                    </p>
                  )}
                </div>
                {event.extendedProps?.confirmationNumber && (
                  <div className="text-right">
                    <span className="text-xs text-slate-500">Conf #</span>
                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                      {event.extendedProps.confirmationNumber}
                    </p>
                  </div>
                )}
                <button className="text-slate-400 hover:text-purple-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-purple-900 dark:text-white">
                Trip Members
              </h2>
              <button
                onClick={() => setShowInviteModal(true)}
                className="btn-magical text-sm py-2 px-4"
              >
                + Invite Member
              </button>
            </div>
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="card-magical p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                        {member.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900 dark:text-white">
                        {member.user.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.role === "OWNER"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trip Notes */}
        {trip.notes && (
          <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              📝 Trip Notes
            </h3>
            <p className="text-slate-600 dark:text-slate-400">{trip.notes}</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-4">
              Invite a Travel Companion
            </h3>
            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="input-magical"
                  placeholder="friend@example.com"
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                They&apos;ll receive an email invitation to join this trip and view
                all reservations.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn-outline text-sm py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-magical text-sm py-2 px-4">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
