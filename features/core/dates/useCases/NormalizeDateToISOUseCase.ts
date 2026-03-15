export class NormalizeDateToISOUseCase {
  execute(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }

    return dateStr;
  }
}
