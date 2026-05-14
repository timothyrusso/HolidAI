import { ContainerModule } from 'inversify';

import { container } from '@/di/container';
import { TRIP_GEN_TYPES } from '@/features/trip-generation/di/types';
import { GenerateTripUseCase } from '@/features/trip-generation/useCases/GenerateTripUseCase';

const tripGenerationModule = new ContainerModule(({ bind }) => {
  bind(TRIP_GEN_TYPES.GenerateTripUseCase).to(GenerateTripUseCase).inSingletonScope();
});

container.load(tripGenerationModule);
