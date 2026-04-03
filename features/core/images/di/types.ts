export const IMAGES_TYPES = {
  UnsplashApiKey: Symbol.for('Images.UnsplashApiKey'),
  GooglePlacesApiKey: Symbol.for('Images.GooglePlacesApiKey'),
  UnsplashImageRepository: Symbol.for('Images.UnsplashImageRepository'),
  GooglePlacesImageRepository: Symbol.for('Images.GooglePlacesImageRepository'),
  FetchUnsplashImageUseCase: Symbol.for('Images.FetchUnsplashImageUseCase'),
  FetchGooglePlaceImageUseCase: Symbol.for('Images.FetchGooglePlaceImageUseCase'),
} as const;
