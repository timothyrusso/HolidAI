export class ConvertFromUTCToLocaleUseCase {
  execute(dateString: string, locale: string): string {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return '';

    const day = date.getUTCDate();
    const month = date.toLocaleString(locale, { month: 'long' });
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  }
}
