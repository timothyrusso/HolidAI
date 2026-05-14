import { injectable } from 'inversify';

@injectable()
export class ConvertFromUTCToLocaleUseCase {
  /**
   * Converts a UTC date string to a localized date format.
   *
   * @param dateString - The UTC date string in ISO 8601 format (e.g., '2024-01-01T09:00:00Z')
   * @param locale - The locale to use for formatting the month name (e.g., 'es-ES', 'en-US')
   * @returns A string representing the date in the format "DD MMMM YYYY" in the specified locale,
   * or an empty string if the input is invalid.
   *
   * @example
   * // Returns "1 January 2024" for English locale
   * convertFromUTCToLocaleUseCase.execute('2024-01-01T09:00:00Z', 'en-US');
   *
   * @example
   * // Returns "13 March 2025" for English locale
   * convertFromUTCToLocaleUseCase.execute('2025-03-13T09:00:00Z', 'en-US');
   */
  execute(dateString: string, locale: string): string {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return '';

    const day = date.getUTCDate();
    const month = date.toLocaleString(locale, { month: 'long' });
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  }
}
