export interface INavigationService {
  // Auth flows — always replace (no back into previous state)
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
  toTripDetails(params: { id: string; fromGenerate?: string }): void;
  toActivityDetails(params: { tripId: string; activityId: number }): void;

  // Other screens
  toShowAllTrips(): void;
  toChangeLanguage(): void;

  back(): void;
}
