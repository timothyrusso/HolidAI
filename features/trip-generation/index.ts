import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 3;

export { generateTripUseCase } from '@/features/trip-generation/di/resolve';
export type { LocationInfo } from '@/features/trip-generation/domain/entities/LocationInfo';
export { GenerateTripPage } from '@/features/trip-generation/ui/pages/GenerateTripPage/GenerateTripPage';
export { ReviewTripPage } from '@/features/trip-generation/ui/pages/ReviewTripPage/ReviewTripPage';
export { SearchPlacePage } from '@/features/trip-generation/ui/pages/SearchPlacePage/SearchPlacePage';
export { SelectBudgetPage } from '@/features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage';
export { SelectDatesPage } from '@/features/trip-generation/ui/pages/SelectDatesPage/SelectDatesPage';
export { SelectTravelersPage } from '@/features/trip-generation/ui/pages/SelectTravelersPage/SelectTravelersPage';
