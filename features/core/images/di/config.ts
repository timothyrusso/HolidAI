import 'reflect-metadata';

import '@/features/core/error';
import '@/features/core/http';
import { GooglePlacesImageRepository } from '@/features/core/images/data/repositories/GooglePlacesImageRepository';
import { UnsplashImageRepository } from '@/features/core/images/data/repositories/UnsplashImageRepository';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import { FetchGooglePlaceImageUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImageUseCase';
import { FetchGooglePlaceImagesUseCase } from '@/features/core/images/useCases/FetchGooglePlaceImagesUseCase';
import { FetchUnsplashImageUseCase } from '@/features/core/images/useCases/FetchUnsplashImageUseCase';
import Constants from 'expo-constants';
import { container } from 'tsyringe';

container.registerInstance(IMAGES_TYPES.UnsplashApiKey, Constants.expoConfig?.extra?.unsplashAccessKey ?? '');
container.registerInstance(IMAGES_TYPES.GooglePlacesApiKey, Constants.expoConfig?.extra?.googlePlacesApiKey ?? '');

container.registerSingleton(IMAGES_TYPES.UnsplashImageRepository, UnsplashImageRepository);
container.registerSingleton(IMAGES_TYPES.GooglePlacesImageRepository, GooglePlacesImageRepository);
container.registerSingleton(IMAGES_TYPES.GooglePlacesImageListRepository, GooglePlacesImageRepository);

container.registerSingleton(IMAGES_TYPES.FetchUnsplashImageUseCase, FetchUnsplashImageUseCase);
container.registerSingleton(IMAGES_TYPES.FetchGooglePlaceImageUseCase, FetchGooglePlaceImageUseCase);
container.registerSingleton(IMAGES_TYPES.FetchGooglePlaceImagesUseCase, FetchGooglePlaceImagesUseCase);
