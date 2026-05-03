import 'reflect-metadata';

import '@/features/ai';
import '@/features/core/error';
import { TRIP_GEN_TYPES } from '@/features/trip-generation/di/types';
import { GenerateTripUseCase } from '@/features/trip-generation/useCases/GenerateTripUseCase';
import { container } from 'tsyringe';

container.registerSingleton(TRIP_GEN_TYPES.GenerateTripUseCase, GenerateTripUseCase);
