/**
 * Normalizes a date string to ISO format (YYYY-MM-DD).
 * Handles both YYYY-MM-DD and DD/MM/YYYY formats.
 * @example
 * normalizeDateToISOUseCase("28/02/2026") // "2026-02-28"
 * normalizeDateToISOUseCase("2026-02-28") // "2026-02-28"
 */
export const normalizeDateToISOUseCase = (dateStr: string): string => {
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  return dateStr;
};
