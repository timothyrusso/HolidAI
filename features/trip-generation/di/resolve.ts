import '@/features/trip-generation/di/config';

import { container } from '@/features/core/container';
import { TRIP_GEN_TYPES } from '@/features/trip-generation/di/types';
import type { GenerateTripUseCase } from '@/features/trip-generation/useCases/GenerateTripUseCase';

export const generateTripUseCase = container.get<GenerateTripUseCase>(TRIP_GEN_TYPES.GenerateTripUseCase);
