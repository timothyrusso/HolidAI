import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { ImagesLive } from '@/features/core/images/di/layer';
export {
  buildPlacePhotoUrlUseCase,
  fetchPhotoNamesUseCase,
  fetchUnsplashImageUseCase,
  fetchWikimediaDishImageUseCase,
} from '@/features/core/images/di/resolve';
export { IMAGES_TYPES } from '@/features/core/images/di/types';
export type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
export type { ImageRequest } from '@/features/core/images/domain/entities/ImageRequest';
export type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
export { IMAGE_RESOLUTION } from '@/features/core/images/domain/entities/imageResolutions';
export type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';
export type { UrlType as UrlTypeValue } from '@/features/core/images/domain/entities/UrlType';
export { UrlType } from '@/features/core/images/domain/entities/UrlType';
export { ImageRepository } from '@/features/core/images/domain/repositories/ImageRepository';
export { useGetImage } from '@/features/core/images/facades/useGetImage';
export type { FetchPhotoNamesUseCase } from '@/features/core/images/useCases/FetchPhotoNamesUseCase';
export type { FetchUnsplashImageUseCase } from '@/features/core/images/useCases/FetchUnsplashImageUseCase';
export type { FetchWikimediaDishImageUseCase } from '@/features/core/images/useCases/FetchWikimediaDishImageUseCase';
