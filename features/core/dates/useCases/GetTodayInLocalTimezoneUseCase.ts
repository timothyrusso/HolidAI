import { injectable } from 'inversify';

@injectable()
export class GetTodayInLocalTimezoneUseCase {
  /**
   * Gets the current date and time adjusted to the local timezone.
   * @example
   * const localDate = getTodayInLocalTimezoneUseCase.execute();
   * console.log(localDate); // Outputs the current date and time in the local timezone
   */
  execute(): Date {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  }
}
