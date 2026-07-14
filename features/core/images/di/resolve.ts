import '@/features/core/images/di/config';

import { container } from '@/features/core/container';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { BuildPlacePhotoUrlUseCase } from '@/features/core/images/useCases/BuildPlacePhotoUrlUseCase';
import type { FetchGooglePlaceImagesUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImagesUseCase';
import type { FetchGooglePlaceImageUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImageUseCase';
import type { FetchPhotoNamesUseCase } from '@/features/core/images/useCases/FetchPhotoNamesUseCase';
import type { FetchUnsplashImageUseCase } from '@/features/core/images/useCases/FetchUnsplashImageUseCase';
import type { FetchWikimediaDishImageUseCase } from '@/features/core/images/useCases/FetchWikimediaDishImageUseCase';

export const fetchUnsplashImageUseCase = container.get<FetchUnsplashImageUseCase>(
  IMAGES_TYPES.FetchUnsplashImageUseCase,
);
export const fetchGooglePlaceImageUseCase = container.get<FetchGooglePlaceImageUseCase>(
  IMAGES_TYPES.FetchGooglePlaceImageUseCase,
);
export const fetchGooglePlaceImagesUseCase = container.get<FetchGooglePlaceImagesUseCase>(
  IMAGES_TYPES.FetchGooglePlaceImagesUseCase,
);
export const fetchWikimediaDishImageUseCase = container.get<FetchWikimediaDishImageUseCase>(
  IMAGES_TYPES.FetchWikimediaDishImageUseCase,
);
export const buildPlacePhotoUrlUseCase = container.get<BuildPlacePhotoUrlUseCase>(
  IMAGES_TYPES.BuildPlacePhotoUrlUseCase,
);
export const fetchPhotoNamesUseCase = container.get<FetchPhotoNamesUseCase>(IMAGES_TYPES.FetchPhotoNamesUseCase);
