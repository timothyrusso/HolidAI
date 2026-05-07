import 'reflect-metadata';

import '@/features/core/images/di/config';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { FetchGooglePlaceImageUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImageUseCase';
import type { FetchGooglePlaceImagesUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImagesUseCase';
import type { FetchUnsplashImageUseCase } from '@/features/core/images/useCases/FetchUnsplashImageUseCase';
import { container } from 'tsyringe';

export const fetchUnsplashImageUseCase = container.resolve<FetchUnsplashImageUseCase>(
  IMAGES_TYPES.FetchUnsplashImageUseCase,
);
export const fetchGooglePlaceImageUseCase = container.resolve<FetchGooglePlaceImageUseCase>(
  IMAGES_TYPES.FetchGooglePlaceImageUseCase,
);
export const fetchGooglePlaceImagesUseCase = container.resolve<FetchGooglePlaceImagesUseCase>(
  IMAGES_TYPES.FetchGooglePlaceImagesUseCase,
);
