import '@/features/core/dates/di/config';

import { container } from '@/features/core/container';
import { DATES_TYPES } from '@/features/core/dates/di/types';
import type { ConvertFromUTCToLocaleUseCase } from '@/features/core/dates/useCases/ConvertFromUTCToLocaleUseCase';
import type { FormatDateForPromptUseCase } from '@/features/core/dates/useCases/FormatDateForPromptUseCase';
import type { GetTimezoneFormattedDateUseCase } from '@/features/core/dates/useCases/GetTimezoneFormattedDateUseCase';
import type { GetTodayInLocalTimezoneUseCase } from '@/features/core/dates/useCases/GetTodayInLocalTimezoneUseCase';
import type { TranslateDateUseCase } from '@/features/core/dates/useCases/TranslateDateUseCase';

export const convertFromUTCToLocaleUseCase = container.get<ConvertFromUTCToLocaleUseCase>(
  DATES_TYPES.ConvertFromUTCToLocaleUseCase,
);
export const formatDateForPromptUseCase = container.get<FormatDateForPromptUseCase>(
  DATES_TYPES.FormatDateForPromptUseCase,
);
export const getTimezoneFormattedDateUseCase = container.get<GetTimezoneFormattedDateUseCase>(
  DATES_TYPES.GetTimezoneFormattedDateUseCase,
);
export const getTodayInLocalTimezoneUseCase = container.get<GetTodayInLocalTimezoneUseCase>(
  DATES_TYPES.GetTodayInLocalTimezoneUseCase,
);
export const translateDateUseCase = container.get<TranslateDateUseCase>(DATES_TYPES.TranslateDateUseCase);
