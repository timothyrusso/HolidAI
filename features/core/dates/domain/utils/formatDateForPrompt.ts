/**
 * The ISO date (YYYY-MM-DD) of `date` for an AI prompt, or an empty string when there is none. The
 * wizard's dates are already shifted by {@link getTimezoneFormattedDate}, so the UTC date is the
 * local one.
 */
export const formatDateForPrompt = (date: Date | null): string => (date ? date.toISOString().split('T')[0] : '');
