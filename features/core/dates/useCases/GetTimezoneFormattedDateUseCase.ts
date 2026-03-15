export class GetTimezoneFormattedDateUseCase {
  execute(date: Date): Date {
    return date && new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
}
