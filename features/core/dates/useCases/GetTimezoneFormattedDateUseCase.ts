import { injectable } from 'inversify';

@injectable()
export class GetTimezoneFormattedDateUseCase {
  /**
   * Adjusts the given date to the local timezone.
   *
   * This function takes a date object and adjusts it to the local timezone
   * by subtracting the timezone offset in milliseconds.
   *
   * @param date - The date to be adjusted to the local timezone. Must be a raw, unadjusted date
   * (e.g. from a calendar picker). Do not pass the output of `GetTodayInLocalTimezoneUseCase` —
   * that date is already adjusted and passing it here will subtract the offset twice.
   * @returns The adjusted date in the local timezone.
   * @example
   * const date = new Date('2024-10-31T11:00:00.000Z');
   * const localDate = getTimezoneFormattedDateUseCase.execute(date);
   * console.log(localDate); // Outputs the date adjusted to the local timezone
   */
  execute(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
}
