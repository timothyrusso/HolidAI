import 'reflect-metadata';

import '@/features/trip-generation/di/config';
import { TRIP_GEN_TYPES } from '@/features/trip-generation/di/types';
import type { GenerateTripUseCase } from '@/features/trip-generation/useCases/GenerateTripUseCase';
import { container } from 'tsyringe';

export const generateTripUseCase = container.resolve<GenerateTripUseCase>(TRIP_GEN_TYPES.GenerateTripUseCase);
