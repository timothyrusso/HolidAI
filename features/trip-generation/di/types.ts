export const TRIP_GEN_TYPES = {
  GenerateTripUseCase: Symbol.for('GenerateTripUseCase'),
  EnrichTripWithPhotosUseCase: Symbol.for('EnrichTripWithPhotosUseCase'),
  EnrichDishesWithImagesUseCase: Symbol.for('EnrichDishesWithImagesUseCase'),
  EnrichTripWithCoverImageUseCase: Symbol.for('EnrichTripWithCoverImageUseCase'),
} as const;
