import '@/features/trip-generation/di/config';

import { container } from '@/features/core/container';
import { TRIP_GEN_TYPES } from '@/features/trip-generation/di/types';
import type { EnrichDishesWithImagesUseCase } from '@/features/trip-generation/useCases/EnrichDishesWithImagesUseCase';
import type { EnrichTripWithPhotosUseCase } from '@/features/trip-generation/useCases/EnrichTripWithPhotosUseCase';
import type { GenerateTripUseCase } from '@/features/trip-generation/useCases/GenerateTripUseCase';

export const generateTripUseCase = container.get<GenerateTripUseCase>(TRIP_GEN_TYPES.GenerateTripUseCase);
export const enrichTripWithPhotosUseCase = container.get<EnrichTripWithPhotosUseCase>(
  TRIP_GEN_TYPES.EnrichTripWithPhotosUseCase,
);
export const enrichDishesWithImagesUseCase = container.get<EnrichDishesWithImagesUseCase>(
  TRIP_GEN_TYPES.EnrichDishesWithImagesUseCase,
);
