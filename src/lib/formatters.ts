// Shared formatting utilities for Magical Holidays

/**
 * Parse a date string as a local date (not UTC).
 * Date-only strings like "2026-04-01" are parsed as UTC by the Date constructor,
 * which shifts them back a day in US timezones. This helper avoids that.
 */
export function parseLocalDate(str: string): Date {
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  return new Date(str);
}

/**
 * Format a date range for display
 * @param startStr - ISO date string for start date
 * @param endStr - ISO date string for end date
 * @param options - Formatting options
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startStr: string,
  endStr: string,
  options: {
    includeWeekday?: boolean;
    shortFormat?: boolean;
  } = {}
): string => {
  const { includeWeekday = false, shortFormat = false } = options;
  const start = parseLocalDate(startStr);
  const end = parseLocalDate(endStr);

  const startOptions: Intl.DateTimeFormatOptions = shortFormat
    ? { month: "short", day: "numeric" }
    : {
        ...(includeWeekday && { weekday: "long" }),
        month: "long",
        day: "numeric",
      };

  const endOptions: Intl.DateTimeFormatOptions = shortFormat
    ? { month: "short", day: "numeric", year: "numeric" }
    : {
        ...(includeWeekday && { weekday: "long" }),
        month: "long",
        day: "numeric",
        year: "numeric",
      };

  const startFormatted = start.toLocaleDateString("en-US", startOptions);
  const endFormatted = end.toLocaleDateString("en-US", endOptions);

  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Calculate days until a date
 * @param dateStr - ISO date string
 * @returns Number of days until the date (negative if in past)
 */
export const getDaysUntil = (dateStr: string): number => {
  const date = parseLocalDate(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Get a human-readable "days until" label
 * @param dateStr - ISO date string
 * @returns Formatted string like "In 5 days", "Tomorrow", "Today", "2 days ago"
 */
export const getDaysUntilLabel = (dateStr: string): string => {
  const days = getDaysUntil(dateStr);

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
};

/**
 * Format a single date for display
 * @param dateStr - ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string => {
  return parseLocalDate(dateStr).toLocaleDateString("en-US", options);
};

/**
 * Format a datetime for display
 * @param dateStr - ISO date string
 * @returns Formatted datetime string
 */
export const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Format time only
 * @param dateStr - ISO date string
 * @returns Formatted time string
 */
export const formatTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};
