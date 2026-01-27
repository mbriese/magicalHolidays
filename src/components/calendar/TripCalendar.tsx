"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import type { CalendarEvent, ReservationType } from "@/types";
import { reservationClassNames, reservationLabels } from "@/types";

interface TripCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (eventId: string) => void;
  onDateSelect?: (start: Date, end: Date) => void;
  onEventDrop?: (eventId: string, newStart: Date, newEnd: Date) => void;
  editable?: boolean;
}

export default function TripCalendar({
  events,
  onEventClick,
  onDateSelect,
  onEventDrop,
  editable = true,
}: TripCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Transform events for FullCalendar
  const calendarEvents = events.map((event) => ({
    ...event,
    className: event.extendedProps?.type
      ? reservationClassNames[event.extendedProps.type]
      : "",
  }));

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
    onEventClick?.(eventId);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    onDateSelect?.(selectInfo.start, selectInfo.end);
  };

  const handleEventDrop = (dropInfo: { event: { id: string; start: Date | null; end: Date | null } }) => {
    if (dropInfo.event.start && dropInfo.event.end) {
      onEventDrop?.(dropInfo.event.id, dropInfo.event.start, dropInfo.event.end);
    }
  };

  return (
    <div className="trip-calendar">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">
          Legend:
        </span>
        {(Object.keys(reservationLabels) as ReservationType[]).map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${reservationClassNames[type].replace("fc-event-", "bg-reservation-")}`}
              style={{
                backgroundColor:
                  type === "PARK"
                    ? "#8b5cf6"
                    : type === "RIDE"
                    ? "#3b82f6"
                    : type === "HOTEL"
                    ? "#f59e0b"
                    : type === "CAR"
                    ? "#22c55e"
                    : "#0ea5e9",
              }}
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {reservationLabels[type]}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          editable={editable}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={3}
          weekends={true}
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          height="auto"
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
        />
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white">
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {selectedEvent.extendedProps?.type && (
              <div className="mb-3">
                <span
                  className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{
                    backgroundColor:
                      selectedEvent.extendedProps.type === "PARK"
                        ? "#8b5cf6"
                        : selectedEvent.extendedProps.type === "RIDE"
                        ? "#3b82f6"
                        : selectedEvent.extendedProps.type === "HOTEL"
                        ? "#f59e0b"
                        : selectedEvent.extendedProps.type === "CAR"
                        ? "#22c55e"
                        : "#0ea5e9",
                  }}
                >
                  {reservationLabels[selectedEvent.extendedProps.type]}
                </span>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  When:
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {new Date(selectedEvent.start).toLocaleString()} -{" "}
                  {new Date(selectedEvent.end).toLocaleString()}
                </p>
              </div>

              {selectedEvent.extendedProps?.location && (
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Location:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedEvent.extendedProps.location}
                  </p>
                </div>
              )}

              {selectedEvent.extendedProps?.confirmationNumber && (
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Confirmation #:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 font-mono">
                    {selectedEvent.extendedProps.confirmationNumber}
                  </p>
                </div>
              )}

              {selectedEvent.extendedProps?.notes && (
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Notes:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedEvent.extendedProps.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="btn-outline text-sm py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
