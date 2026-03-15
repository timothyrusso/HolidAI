import { isValid, parse } from 'date-fns';

export class TranslateDateUseCase {
  /**
   * Resolves a date value to a `Date` instance.
   * Accepts an existing `Date` object or a string in any of the common formats
   * (dd/MM/yyyy, MM/dd/yyyy, yyyy/dd/MM, yyyy-MM-dd, dd-MM-yyyy, MM-dd-yyyy).
   * @param date - The date value to resolve.
   * @returns A `Date` instance.
   * @throws If the input is missing or does not match any supported format.
   */
  private getDateInstance(date?: Date | string | null): Date {
    if (!date) throw new Error('Missing date');

    if (typeof date === 'string') {
      const formats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy/dd/MM', 'yyyy-MM-dd', 'dd-MM-yyyy', 'MM-dd-yyyy'];

      for (const format of formats) {
        const parsedDate = parse(date, format, new Date());
        if (isValid(parsedDate)) return parsedDate;
      }

      throw new Error('Invalid date format');
    }

    return date;
  }

  /**
   * Translates a date ISO 8601 string or a date instance based on the user locale.
   * @param locale - The locale to use for formatting (e.g., 'en-US', 'it-IT').
   * @param date - The date ISO 8601 string or date instance to translate.
   * @returns The translated date string, or an empty string if the input is missing or invalid.
   */
  execute(locale: string, date?: Date | string | null): string {
    try {
      const dateInstance = this.getDateInstance(date);
      return dateInstance.toLocaleDateString(locale);
    } catch {
      return '';
    }
  }
}
