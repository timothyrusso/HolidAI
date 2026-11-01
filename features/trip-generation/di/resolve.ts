import '@/features/trip-generation/di/config';

import { container } from '@/features/core/container';
import { TRIP_GEN_TYPES } from '@/features/trip-generation/di/types';
import type { EnrichDishesWithImagesUseCase } from '@/features/trip-generation/useCases/EnrichDishesWithImagesUseCase';
import type { EnrichTripWithCoverImageUseCase } from '@/features/trip-generation/useCases/EnrichTripWithCoverImageUseCase';
import type { EnrichTripWithPhotosUseCase } from '@/features/trip-generation/useCases/EnrichTripWithPhotosUseCase';

export const enrichTripWithPhotosUseCase = container.get<EnrichTripWithPhotosUseCase>(
  TRIP_GEN_TYPES.EnrichTripWithPhotosUseCase,
);
export const enrichDishesWithImagesUseCase = container.get<EnrichDishesWithImagesUseCase>(
  TRIP_GEN_TYPES.EnrichDishesWithImagesUseCase,
);
export const enrichTripWithCoverImageUseCase = container.get<EnrichTripWithCoverImageUseCase>(
  TRIP_GEN_TYPES.EnrichTripWithCoverImageUseCase,
);
