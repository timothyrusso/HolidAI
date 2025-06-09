import { isValid, parse } from 'date-fns';

const getDateInstance = (date?: Date | string | null) => {
  if (!date) throw new Error('Missing date');

  if (typeof date === 'string') {
    // Try different common date formats
    const formats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy/dd/MM', 'yyyy-MM-dd', 'dd-MM-yyyy', 'MM-dd-yyyy'];

    for (const format of formats) {
      const parsedDate = parse(date, format, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    throw new Error('Invalid date format');
  }

  return date;
};

/**
 * Translates a date ISO 8601 string or a date instance based on the user locale.
 * @param date - The date ISO 8601 string or date instance to translate.
 * @param defaultOptions - If set to true, use default options (es. 01/01/1970)
 * @returns The translated date string.
 */
export const translateDate = (locale: string, date?: Date | string | null): string => {
  try {
    const dateInstance = getDateInstance(date);
    const translatedDate = dateInstance.toLocaleDateString(locale);
    return translatedDate;
  } catch {
    return '';
  }
};
