export class GetTimezoneFormattedDateUseCase {
  execute(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
}
