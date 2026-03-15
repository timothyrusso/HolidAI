import 'reflect-metadata';

import { container } from 'tsyringe';

import { ConvertFromUTCToLocaleUseCase } from '@/features/core/dates/useCases/ConvertFromUTCToLocaleUseCase';
import { FormatDateForPromptUseCase } from '@/features/core/dates/useCases/FormatDateForPromptUseCase';
import { GetTimezoneFormattedDateUseCase } from '@/features/core/dates/useCases/GetTimezoneFormattedDateUseCase';
import { GetTodayInLocalTimezoneUseCase } from '@/features/core/dates/useCases/GetTodayInLocalTimezoneUseCase';
import { NormalizeDateToISOUseCase } from '@/features/core/dates/useCases/NormalizeDateToISOUseCase';
import { TranslateDateUseCase } from '@/features/core/dates/useCases/TranslateDateUseCase';

import { DATES_TYPES } from './types';

container.registerSingleton(DATES_TYPES.ConvertFromUTCToLocaleUseCase, ConvertFromUTCToLocaleUseCase);
container.registerSingleton(DATES_TYPES.FormatDateForPromptUseCase, FormatDateForPromptUseCase);
container.registerSingleton(DATES_TYPES.GetTimezoneFormattedDateUseCase, GetTimezoneFormattedDateUseCase);
container.registerSingleton(DATES_TYPES.GetTodayInLocalTimezoneUseCase, GetTodayInLocalTimezoneUseCase);
container.registerSingleton(DATES_TYPES.NormalizeDateToISOUseCase, NormalizeDateToISOUseCase);
container.registerSingleton(DATES_TYPES.TranslateDateUseCase, TranslateDateUseCase);
