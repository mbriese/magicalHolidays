// Type definitions for Magical Holidays

// Reservation Types
export type ReservationType = "PARK" | "RIDE" | "HOTEL" | "CAR" | "FLIGHT";

// Trip Roles
export type TripRole = "OWNER" | "MEMBER";

// Blog Categories
export type BlogCategory = "PARK_UPDATE" | "HOLIDAY_EVENT" | "GENERAL" | "TIP";

// Color mapping for reservation types
export const reservationColors: Record<ReservationType, string> = {
  PARK: "#8b5cf6",    // Purple
  RIDE: "#3b82f6",    // Blue
  HOTEL: "#f59e0b",   // Gold
  CAR: "#22c55e",     // Green
  FLIGHT: "#0ea5e9",  // Sky blue
};

// CSS class mapping for reservation types
export const reservationClassNames: Record<ReservationType, string> = {
  PARK: "fc-event-park",
  RIDE: "fc-event-ride",
  HOTEL: "fc-event-hotel",
  CAR: "fc-event-car",
  FLIGHT: "fc-event-flight",
};

// Labels for reservation types
export const reservationLabels: Record<ReservationType, string> = {
  PARK: "Park Reservation",
  RIDE: "Ride / Attraction",
  HOTEL: "Hotel",
  CAR: "Car Rental",
  FLIGHT: "Flight",
};

// Blog category labels
export const blogCategoryLabels: Record<BlogCategory, string> = {
  PARK_UPDATE: "Park Update",
  HOLIDAY_EVENT: "Holiday Event",
  GENERAL: "General",
  TIP: "Tip",
};

// Interfaces for API responses and component props
export interface User {
  id: string;
  email: string;
  name: string | null;
  favoriteCharacters: string[];
  createdAt: Date;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  notes: string | null;
  ownerId: string;
  createdAt: Date;
}

export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: TripRole;
  joinedAt: Date;
  user?: User;
}

export interface Reservation {
  id: string;
  tripId: string;
  type: ReservationType;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string | null;
  confirmationNumber: string | null;
  notes: string | null;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: BlogCategory;
  isPublished: boolean;
  publishedAt: Date | null;
  authorId: string;
  createdAt: Date;
  author?: User;
}

export interface DisneyNugget {
  id: string;
  type: "quote" | "fact" | "history";
  content: string;
  source: string | null;
  characters: string[];
}

// Calendar Event interface for FullCalendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  className?: string;
  extendedProps?: {
    type: ReservationType;
    location?: string;
    confirmationNumber?: string;
    notes?: string;
  };
}

// Form data interfaces
export interface CreateTripInput {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface CreateReservationInput {
  tripId: string;
  type: ReservationType;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  confirmationNumber?: string;
  notes?: string;
}

export interface InviteMemberInput {
  tripId: string;
  email: string;
}
