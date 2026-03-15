export const DATES_TYPES = {
  ConvertFromUTCToLocaleUseCase: Symbol.for('ConvertFromUTCToLocaleUseCase'),
  FormatDateForPromptUseCase: Symbol.for('FormatDateForPromptUseCase'),
  GetTimezoneFormattedDateUseCase: Symbol.for('GetTimezoneFormattedDateUseCase'),
  GetTodayInLocalTimezoneUseCase: Symbol.for('GetTodayInLocalTimezoneUseCase'),
  NormalizeDateToISOUseCase: Symbol.for('NormalizeDateToISOUseCase'),
  TranslateDateUseCase: Symbol.for('TranslateDateUseCase'),
} as const;
