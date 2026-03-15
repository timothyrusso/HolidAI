export class NormalizeDateToISOUseCase {
  /**
   * Normalizes a date string to ISO format (YYYY-MM-DD).
   * Supported input formats: ISO (YYYY-MM-DD) and DD/MM/YYYY (as returned by AI when it deviates from the prompt).
   * Other slash-separated formats (e.g. MM/DD/YYYY) are not supported — callers must not pass them.
   * @example
   * normalizeDateToISOUseCase.execute("28/02/2026") // "2026-02-28"
   * normalizeDateToISOUseCase.execute("2026-02-28") // "2026-02-28"
   */
  execute(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }

    return dateStr;
  }
}
