import { ContainerModule } from 'inversify';

import { container } from '@/features/core/container';
import { TRIP_GEN_TYPES } from '@/features/trip-generation/di/types';
import { EnrichDishesWithImagesUseCase } from '@/features/trip-generation/useCases/EnrichDishesWithImagesUseCase';
import { EnrichTripWithCoverImageUseCase } from '@/features/trip-generation/useCases/EnrichTripWithCoverImageUseCase';
import { EnrichTripWithPhotosUseCase } from '@/features/trip-generation/useCases/EnrichTripWithPhotosUseCase';

const tripGenerationModule = new ContainerModule(({ bind }) => {
  bind(TRIP_GEN_TYPES.EnrichTripWithPhotosUseCase).to(EnrichTripWithPhotosUseCase).inSingletonScope();
  bind(TRIP_GEN_TYPES.EnrichDishesWithImagesUseCase).to(EnrichDishesWithImagesUseCase).inSingletonScope();
  bind(TRIP_GEN_TYPES.EnrichTripWithCoverImageUseCase).to(EnrichTripWithCoverImageUseCase).inSingletonScope();
});

container.load(tripGenerationModule);
