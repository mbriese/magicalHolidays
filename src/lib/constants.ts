// Shared constants for Magical Holidays

import type { ReservationType } from "@/types";

/**
 * Available reservation types
 */
export const RESERVATION_TYPES: ReservationType[] = [
  "PARK",
  "RIDE", 
  "HOTEL",
  "CAR",
  "FLIGHT",
];

/**
 * Available Disney destinations for trip selection
 */
export const DESTINATIONS = [
  "Walt Disney World",
  "Disneyland Resort",
  "Tokyo Disney Resort",
  "Disneyland Paris",
  "Hong Kong Disneyland",
  "Shanghai Disney Resort",
  "Other",
] as const;

export type Destination = (typeof DESTINATIONS)[number];

/**
 * Map destinations to their available parks
 */
export const DESTINATION_PARKS: Record<string, string[]> = {
  "Walt Disney World": ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
  "Disneyland Resort": ["Disneyland", "California Adventure"],
  "Tokyo Disney Resort": ["Tokyo Disneyland", "Tokyo DisneySea"],
  "Disneyland Paris": ["Disneyland Park", "Walt Disney Studios Park"],
  "Hong Kong Disneyland": ["Hong Kong Disneyland"],
  "Shanghai Disney Resort": ["Shanghai Disneyland"],
};

/**
 * Get parks available for a destination
 */
export const getParksForDestination = (destination: string): string[] => {
  return DESTINATION_PARKS[destination] || [];
};
