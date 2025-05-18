import { AppKeys } from '@/modules/shared/domain/AppKeys';
import * as Localization from 'expo-localization';

/**
 * Converts a UTC date string to a localized date format.
 *
 * @param dateString - The UTC date string in ISO 8601 format (e.g., '2024-01-01T09:00:00Z')
 * @param locale - The locale to use for formatting the month name (e.g., 'es-ES', 'en-US')
 * @returns A string representing the date in the format "DD MMMM YYYY" in the specified locale
 *
 * @example
 * // Returns "1 January 2024" for English locale
 * convertFromUTCToLocale('2024-01-01T09:00:00Z', 'en-US');
 *
 * @example
 * // Returns "13 March 2025" for English locale
 * convertFromUTCToLocale('2025-03-13T09:00:00Z', 'en-US');
 */
export const convertFromUTCToLocaleUseCase = (dateString: string): string => {
  const locale = Localization.getLocales()[0].languageCode ?? AppKeys.defaultLanguage;

  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
};
