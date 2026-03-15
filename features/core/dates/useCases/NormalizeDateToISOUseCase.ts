export class NormalizeDateToISOUseCase {
  // Supported input formats: ISO (YYYY-MM-DD) and DD/MM/YYYY (as returned by AI when it deviates from the prompt).
  // Other slash-separated formats (e.g. MM/DD/YYYY) are not supported — callers must not pass them.
  execute(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }

    return dateStr;
  }
}
