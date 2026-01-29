// Type definitions for Magical Holidays

// Reservation Types
export type ReservationType = "PARK" | "RIDE" | "HOTEL" | "CAR" | "FLIGHT";

// Trip Roles
export type TripRole = "OWNER" | "MEMBER";

// Blog Categories
export type BlogCategory = "PARK_UPDATE" | "HOLIDAY_EVENT" | "GENERAL" | "TIP";

// Badge Categories
export type BadgeCategory = "ADVENTURE" | "EXPERIENCE" | "EXPLORER" | "SPECIAL";

// Badge Rarity
export type BadgeRarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";

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

// Badge interfaces
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  requirement: string;
  threshold: number;
  createdAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  progress: number;
  earnedAt: Date | null;
  createdAt: Date;
  badge?: Badge;
}

// Combined badge with user progress (used across components)
export interface BadgeWithProgress extends Badge {
  userProgress?: number;
  earnedAt?: Date | null;
}

// Badge display helpers
export const badgeCategoryLabels: Record<BadgeCategory, string> = {
  ADVENTURE: "Adventure",
  EXPERIENCE: "Experience",
  EXPLORER: "Explorer",
  SPECIAL: "Special",
};

export const badgeCategoryIcons: Record<BadgeCategory, string> = {
  ADVENTURE: "🏰",
  EXPERIENCE: "⭐",
  EXPLORER: "🧭",
  SPECIAL: "✨",
};

export const badgeRarityLabels: Record<BadgeRarity, string> = {
  COMMON: "Common",
  UNCOMMON: "Uncommon",
  RARE: "Rare",
  EPIC: "Epic",
  LEGENDARY: "Legendary",
};

// Progress bar colors for badges by rarity
export const badgeProgressColors: Record<BadgeRarity, string> = {
  COMMON: "bg-green-500",
  UNCOMMON: "bg-green-500",
  RARE: "bg-blue-500",
  EPIC: "bg-purple-500",
  LEGENDARY: "bg-linear-to-r from-amber-400 to-yellow-500",
};

export const badgeRarityColors: Record<BadgeRarity, { bg: string; border: string; text: string; glow: string }> = {
  COMMON: {
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-600",
    text: "text-slate-600 dark:text-slate-300",
    glow: "",
  },
  UNCOMMON: {
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-400 dark:border-green-600",
    text: "text-green-700 dark:text-green-400",
    glow: "",
  },
  RARE: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-400 dark:border-blue-500",
    text: "text-blue-700 dark:text-blue-400",
    glow: "shadow-blue-400/30",
  },
  EPIC: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-400 dark:border-purple-500",
    text: "text-purple-700 dark:text-purple-400",
    glow: "shadow-purple-400/40",
  },
  LEGENDARY: {
    bg: "bg-linear-to-br from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40",
    border: "border-amber-400 dark:border-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    glow: "shadow-amber-400/50",
  },
};
