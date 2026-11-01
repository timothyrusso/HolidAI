export const IMAGES_TYPES = {
  UnsplashApiKey: Symbol.for('Images.UnsplashApiKey'),
  GooglePlacesApiKey: Symbol.for('Images.GooglePlacesApiKey'),
  UnsplashImageRepository: Symbol.for('Images.UnsplashImageRepository'),
  GooglePlacesPhotoNamesRepository: Symbol.for('Images.GooglePlacesPhotoNamesRepository'),
  FetchUnsplashImageUseCase: Symbol.for('Images.FetchUnsplashImageUseCase'),
  WikimediaDishImageRepository: Symbol.for('Images.WikimediaDishImageRepository'),
  FetchWikimediaDishImageUseCase: Symbol.for('Images.FetchWikimediaDishImageUseCase'),
  BuildPlacePhotoUrlUseCase: Symbol.for('Images.BuildPlacePhotoUrlUseCase'),
  FetchPhotoNamesUseCase: Symbol.for('Images.FetchPhotoNamesUseCase'),
} as const;
