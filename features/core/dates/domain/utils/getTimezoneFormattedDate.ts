/**
 * `date` shifted by the local timezone offset, so its UTC fields read as the local date and time.
 * Pass a raw date (from a calendar picker), never one this already shifted: the offset would apply
 * twice.
 */
export const getTimezoneFormattedDate = (date: Date): Date =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000);

/** `now`, shifted to the local timezone like {@link getTimezoneFormattedDate}. */
export const getTodayInLocalTimezone = (now: Date = new Date()): Date => getTimezoneFormattedDate(now);
