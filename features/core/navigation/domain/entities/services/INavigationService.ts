import type { NavigationHref } from '@/features/core/navigation/domain/entities/services/IRouterClient';

export interface INavigationService {
  // Auth flows — always replace (no back into previous auth state)
  // toSignIn/toSignUp replace so native back gestures are disabled between auth screens;
  // explicit back navigation is handled by inline links within each screen.
  toAppRoot(): void;
  toHome(): void;
  toWelcome(): void;
  toSignIn(): void;
  toSignUp(): void;

  // Trip creation flow — push through steps, replace at commit point
  toSearch(): void;
  toSelectTravelers(): void;
  toSelectDates(): void;
  toSelectBudget(): void;
  toReviewTrip(): void;
  toGenerateTrip(): void;

  // Detail screens — always push
  toTripDetails(params: { id: string; fromGenerate?: boolean }): void;
  toActivityDetails(params: { tripId: string; activityId: number }): void;

  // Other screens
  toTripList(): void;
  toChangeLanguage(): void;

  back(): void;

  // Escape hatch for dynamic destinations (e.g. error boundaries)
  replace(href: NavigationHref): void;
}
