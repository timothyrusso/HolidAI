/**
 * Formats a timezone-adjusted Date object to an ISO date string (YYYY-MM-DD)
 * for use in AI prompt placeholders.
 *
 * Dates from the trip store are already adjusted via getTimezoneFormattedDateUseCase,
 * so toISOString() reliably returns the correct local date.
 *
 * @example
 * formatDateForPromptUseCase(new Date('2026-03-01T00:00:00Z')) // "2026-03-01"
 */
export const formatDateForPromptUseCase = (date: Date | null): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};
