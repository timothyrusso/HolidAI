import { isValid, parse } from 'date-fns';

export class TranslateDateUseCase {
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

  execute(locale: string, date?: Date | string | null): string {
    try {
      const dateInstance = this.getDateInstance(date);
      return dateInstance.toLocaleDateString(locale);
    } catch {
      return '';
    }
  }
}
