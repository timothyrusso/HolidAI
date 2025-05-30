const getDateInstance = (date?: Date | string | null) => {
  if (!date) throw new Error('Missing date');
  const dateInstance = typeof date === 'string' ? new Date(date) : date;
  return dateInstance;
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
