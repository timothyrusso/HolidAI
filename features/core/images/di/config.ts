import Constants from 'expo-constants';
import { ContainerModule } from 'inversify';

import { container } from '@/features/core/container';
import { GooglePlacesImageRepository } from '@/features/core/images/data/repositories/GooglePlacesImageRepository';
import { UnsplashImageRepository } from '@/features/core/images/data/repositories/UnsplashImageRepository';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import { FetchGooglePlaceImageUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImageUseCase';
import { FetchGooglePlaceImagesUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImagesUseCase';
import { FetchUnsplashImageUseCase } from '@/features/core/images/useCases/FetchUnsplashImageUseCase';

const imagesModule = new ContainerModule(({ bind }) => {
  bind<string>(IMAGES_TYPES.UnsplashApiKey).toConstantValue(Constants.expoConfig?.extra?.unsplashAccessKey ?? '');
  bind<string>(IMAGES_TYPES.GooglePlacesApiKey).toConstantValue(Constants.expoConfig?.extra?.googlePlacesApiKey ?? '');
  bind(IMAGES_TYPES.UnsplashImageRepository).to(UnsplashImageRepository).inSingletonScope();
  bind(IMAGES_TYPES.GooglePlacesImageRepository).to(GooglePlacesImageRepository).inSingletonScope();
  bind(IMAGES_TYPES.GooglePlacesImageListRepository).to(GooglePlacesImageRepository).inSingletonScope();
  bind(IMAGES_TYPES.FetchUnsplashImageUseCase).to(FetchUnsplashImageUseCase).inSingletonScope();
  bind(IMAGES_TYPES.FetchGooglePlaceImageUseCase).to(FetchGooglePlaceImageUseCase).inSingletonScope();
  bind(IMAGES_TYPES.FetchGooglePlaceImagesUseCase).to(FetchGooglePlaceImagesUseCase).inSingletonScope();
});

container.load(imagesModule);
