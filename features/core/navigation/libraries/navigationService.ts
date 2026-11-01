import { type Href, router } from 'expo-router';
import { Modals } from '@/features/core/navigation/domain/entities/Modals';
import type { NavigationHref } from '@/features/core/navigation/domain/entities/NavigationHref';
import { Routes } from '@/features/core/navigation/domain/entities/Routes';
import { Stacks } from '@/features/core/navigation/domain/entities/Stacks';

/** The app's destinations, over expo-router's imperative `router`. */
export const navigationService = {
  toAppRoot: () => router.replace('/'),
  toHome: () => router.replace(`/${Routes.HomePage}` as Href),
  toWelcome: () => router.replace(`/${Routes.Welcome}` as Href),
  toSignInOrSignUp: () => router.replace(`/${Routes.SignInOrSignUp}` as Href),

  toSearch: () => router.push(`/${Stacks.CreateTrip}/${Routes.Search}` as Href),
  toSelectTravelers: () => router.push(`/${Stacks.CreateTrip}/${Routes.SelectTraveler}` as Href),
  toSelectDates: () => router.push(`/${Stacks.CreateTrip}/${Routes.SelectDates}` as Href),
  toSelectBudget: () => router.push(`/${Stacks.CreateTrip}/${Routes.SelectBudget}` as Href),
  toReviewTrip: () => router.push(`/${Stacks.CreateTrip}/${Routes.ReviewTrip}` as Href),

  toGenerateTrip: () => {
    router.dismissAll();
    router.replace(`/${Stacks.CreateTrip}/${Routes.GenerateTrip}` as Href);
  },

  toTripDetails: ({ id, fromGenerate }: { id: string; fromGenerate?: boolean }) =>
    router.push({
      pathname: `/${Stacks.CreateTrip}/${Routes.TripDetails}`,
      params: { id, ...(fromGenerate && { fromGenerate: 'true' }) },
    } as Href),

  toActivityDetails: (params: { tripId: string; activityId: number }) =>
    router.push({ pathname: `/${Stacks.CreateTrip}/${Routes.ActivityDetails}`, params } as Href),

  toTripList: () => router.navigate(`/${Routes.Trips}` as Href),
  toChangeLanguage: () => router.push(`/${Stacks.Profile}/${Routes.ChangeLanguage}` as Href),
  toAccountSettings: () => router.push(`/${Stacks.Profile}/${Routes.AccountSettings}` as Href),
  toTypicalDishesModal: (params: { tripId: string }) =>
    router.push({ pathname: `/${Stacks.CreateTrip}/${Modals.TypicalDishes}`, params } as Href),
  toDishDetailsModal: (params: { tripId: string; searchTerm: string }) =>
    router.push({ pathname: `/${Stacks.CreateTrip}/${Modals.DishDetails}`, params } as Href),

  back: () => router.back(),

  replace: (href: NavigationHref) => router.replace(href as Href),
};
