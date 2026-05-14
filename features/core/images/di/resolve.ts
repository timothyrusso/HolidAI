import '@/features/core/images/di/config';

import { container } from '@/di/container';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { FetchGooglePlaceImageUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImageUseCase';
import type { FetchGooglePlaceImagesUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImagesUseCase';
import type { FetchUnsplashImageUseCase } from '@/features/core/images/useCases/FetchUnsplashImageUseCase';

export const fetchUnsplashImageUseCase = container.get<FetchUnsplashImageUseCase>(
  IMAGES_TYPES.FetchUnsplashImageUseCase,
);
export const fetchGooglePlaceImageUseCase = container.get<FetchGooglePlaceImageUseCase>(
  IMAGES_TYPES.FetchGooglePlaceImageUseCase,
);
export const fetchGooglePlaceImagesUseCase = container.get<FetchGooglePlaceImagesUseCase>(
  IMAGES_TYPES.FetchGooglePlaceImagesUseCase,
);
