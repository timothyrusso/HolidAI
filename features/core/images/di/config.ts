import Constants from 'expo-constants';
import { ContainerModule } from 'inversify';
import { container } from '@/features/core/container';
import { GooglePlacesImageRepository } from '@/features/core/images/data/repositories/GooglePlacesImageRepository';
import { UnsplashImageRepository } from '@/features/core/images/data/repositories/UnsplashImageRepository';
import { WikimediaDishImageRepository } from '@/features/core/images/data/repositories/WikimediaDishImageRepository';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import { BuildPlacePhotoUrlUseCase } from '@/features/core/images/useCases/BuildPlacePhotoUrlUseCase';
import { FetchGooglePlaceImagesUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImagesUseCase';
import { FetchGooglePlaceImageUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImageUseCase';
import { FetchPhotoNamesUseCase } from '@/features/core/images/useCases/FetchPhotoNamesUseCase';
import { FetchUnsplashImageUseCase } from '@/features/core/images/useCases/FetchUnsplashImageUseCase';
import { FetchWikimediaDishImageUseCase } from '@/features/core/images/useCases/FetchWikimediaDishImageUseCase';

const imagesModule = new ContainerModule(({ bind }) => {
  bind<string>(IMAGES_TYPES.UnsplashApiKey).toConstantValue(Constants.expoConfig?.extra?.unsplashAccessKey ?? '');
  bind<string>(IMAGES_TYPES.GooglePlacesApiKey).toConstantValue(Constants.expoConfig?.extra?.googlePlacesApiKey ?? '');
  bind(IMAGES_TYPES.UnsplashImageRepository).to(UnsplashImageRepository).inSingletonScope();
  bind(IMAGES_TYPES.GooglePlacesImageRepository).to(GooglePlacesImageRepository).inSingletonScope();
  bind(IMAGES_TYPES.GooglePlacesImageListRepository).to(GooglePlacesImageRepository).inSingletonScope();
  bind(IMAGES_TYPES.GooglePlacesPhotoNamesRepository).to(GooglePlacesImageRepository).inSingletonScope();
  bind(IMAGES_TYPES.FetchUnsplashImageUseCase).to(FetchUnsplashImageUseCase).inSingletonScope();
  bind(IMAGES_TYPES.FetchGooglePlaceImageUseCase).to(FetchGooglePlaceImageUseCase).inSingletonScope();
  bind(IMAGES_TYPES.FetchGooglePlaceImagesUseCase).to(FetchGooglePlaceImagesUseCase).inSingletonScope();
  bind(IMAGES_TYPES.WikimediaDishImageRepository).to(WikimediaDishImageRepository).inSingletonScope();
  bind(IMAGES_TYPES.FetchWikimediaDishImageUseCase).to(FetchWikimediaDishImageUseCase).inSingletonScope();
  bind(IMAGES_TYPES.BuildPlacePhotoUrlUseCase).to(BuildPlacePhotoUrlUseCase).inSingletonScope();
  bind(IMAGES_TYPES.FetchPhotoNamesUseCase).to(FetchPhotoNamesUseCase).inSingletonScope();
});

container.load(imagesModule);
