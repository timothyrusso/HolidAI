export const Routes = {
  Welcome: 'welcome',
  SignUp: 'sign-up',
  SignIn: 'sign-in',
  HomePage: 'home-page',
  Search: 'search-place',
  SelectTraveler: 'select-traveler',
  SelectDates: 'select-dates',
  SelectBudget: 'select-budget',
  ReviewTrip: 'review-trip',
  GenerateTrip: 'generate-trip',
  TripDetails: 'trip-details',
  ShowAllTrips: 'show-all-trips',
  ChangeLanguage: 'change-language',
  ActivityDetails: 'activity-details',
} as const;

export type Routes = (typeof Routes)[keyof typeof Routes];
