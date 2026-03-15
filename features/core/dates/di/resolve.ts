import 'reflect-metadata';
import './config';

import { container } from 'tsyringe';

import type { ConvertFromUTCToLocaleUseCase } from '@/features/core/dates/useCases/ConvertFromUTCToLocaleUseCase';
import type { FormatDateForPromptUseCase } from '@/features/core/dates/useCases/FormatDateForPromptUseCase';
import type { GetTimezoneFormattedDateUseCase } from '@/features/core/dates/useCases/GetTimezoneFormattedDateUseCase';
import type { GetTodayInLocalTimezoneUseCase } from '@/features/core/dates/useCases/GetTodayInLocalTimezoneUseCase';
import type { NormalizeDateToISOUseCase } from '@/features/core/dates/useCases/NormalizeDateToISOUseCase';
import type { TranslateDateUseCase } from '@/features/core/dates/useCases/TranslateDateUseCase';

import { DATES_TYPES } from './types';

export const convertFromUTCToLocaleUseCase = container.resolve<ConvertFromUTCToLocaleUseCase>(
  DATES_TYPES.ConvertFromUTCToLocaleUseCase,
);
export const formatDateForPromptUseCase = container.resolve<FormatDateForPromptUseCase>(
  DATES_TYPES.FormatDateForPromptUseCase,
);
export const getTimezoneFormattedDateUseCase = container.resolve<GetTimezoneFormattedDateUseCase>(
  DATES_TYPES.GetTimezoneFormattedDateUseCase,
);
export const getTodayInLocalTimezoneUseCase = container.resolve<GetTodayInLocalTimezoneUseCase>(
  DATES_TYPES.GetTodayInLocalTimezoneUseCase,
);
export const normalizeDateToISOUseCase = container.resolve<NormalizeDateToISOUseCase>(
  DATES_TYPES.NormalizeDateToISOUseCase,
);
export const translateDateUseCase = container.resolve<TranslateDateUseCase>(DATES_TYPES.TranslateDateUseCase);
