import { ContainerModule } from 'inversify';

import { container } from '@/di/container';
import { DATES_TYPES } from '@/features/core/dates/di/types';
import { ConvertFromUTCToLocaleUseCase } from '@/features/core/dates/useCases/ConvertFromUTCToLocaleUseCase';
import { FormatDateForPromptUseCase } from '@/features/core/dates/useCases/FormatDateForPromptUseCase';
import { GetTimezoneFormattedDateUseCase } from '@/features/core/dates/useCases/GetTimezoneFormattedDateUseCase';
import { GetTodayInLocalTimezoneUseCase } from '@/features/core/dates/useCases/GetTodayInLocalTimezoneUseCase';
import { TranslateDateUseCase } from '@/features/core/dates/useCases/TranslateDateUseCase';

const datesModule = new ContainerModule(({ bind }) => {
  bind(DATES_TYPES.ConvertFromUTCToLocaleUseCase).to(ConvertFromUTCToLocaleUseCase).inSingletonScope();
  bind(DATES_TYPES.FormatDateForPromptUseCase).to(FormatDateForPromptUseCase).inSingletonScope();
  bind(DATES_TYPES.GetTimezoneFormattedDateUseCase).to(GetTimezoneFormattedDateUseCase).inSingletonScope();
  bind(DATES_TYPES.GetTodayInLocalTimezoneUseCase).to(GetTodayInLocalTimezoneUseCase).inSingletonScope();
  bind(DATES_TYPES.TranslateDateUseCase).to(TranslateDateUseCase).inSingletonScope();
});

container.load(datesModule);
