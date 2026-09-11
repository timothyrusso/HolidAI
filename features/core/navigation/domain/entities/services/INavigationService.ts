import type { NavigationHref } from '@/features/core/navigation/domain/entities/services/IRouterClient';

export interface INavigationService {
  toAppRoot(): void;
  toHome(): void;
  toWelcome(): void;
  toSignInOrSignUp(): void;

  toSearch(): void;
  toSelectTravelers(): void;
  toSelectDates(): void;
  toSelectBudget(): void;
  toReviewTrip(): void;
  toGenerateTrip(): void;

  toTripDetails(params: { id: string; fromGenerate?: boolean }): void;
  toActivityDetails(params: { tripId: string; activityId: number }): void;

  toTripList(): void;
  toChangeLanguage(): void;
  toAccountSettings(): void;
  toTypicalDishesModal(params: { tripId: string }): void;
  toDishDetailsModal(params: { tripId: string; searchTerm: string }): void;

  back(): void;

  replace(href: NavigationHref): void;
}
