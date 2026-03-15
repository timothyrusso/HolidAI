export class GetTodayInLocalTimezoneUseCase {
  execute(): Date {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  }
}
