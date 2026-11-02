/**
 * Normalizes an AI-returned date string to ISO format (YYYY-MM-DD).
 * The AI is prompted to return ISO format but occasionally deviates to DD/MM/YYYY.
 * @param dateStr - Date string in ISO (YYYY-MM-DD) or DD/MM/YYYY format.
 * @returns The date in ISO format.
 */
export const normalizeDateToISO = (dateStr: string): string => {
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};
