import { isValid, parse } from 'date-fns';

const STRING_FORMATS = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy/dd/MM', 'yyyy-MM-dd', 'dd-MM-yyyy', 'MM-dd-yyyy'];

const toDate = (date: Date | string): Date | undefined => {
  if (typeof date !== 'string') return date;
  return STRING_FORMATS.map(format => parse(date, format, new Date())).find(isValid);
};

/**
 * `date` (a `Date`, or a string in one of the common day, month and year orders) as `locale`
 * writes it, or an empty string when it is missing or unreadable.
 */
export const translateDate = (locale: string, date?: Date | string | null): string => {
  const instance = date ? toDate(date) : undefined;
  return instance ? instance.toLocaleDateString(locale) : '';
};
