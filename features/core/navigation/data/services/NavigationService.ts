import { NAVIGATION_TYPES } from '@/features/core/navigation/di/types';
import { Routes } from '@/features/core/navigation/domain/entities/Routes';
import { Stacks } from '@/features/core/navigation/domain/entities/Stacks';
import type { INavigationService } from '@/features/core/navigation/domain/entities/services/INavigationService';
import type { IRouterClient, NavigationHref } from '@/features/core/navigation/domain/entities/services/IRouterClient';
import { inject, injectable } from 'tsyringe';

@injectable()
export class NavigationService implements INavigationService {
  constructor(@inject(NAVIGATION_TYPES.RouterClient) private client: IRouterClient) {}

  toAppRoot() {
    this.client.replace('/');
  }
  toHome() {
    this.client.replace(`/${Routes.HomePage}`);
  }
  toWelcome() {
    this.client.replace(`/${Routes.Welcome}`);
  }
  toSignIn() {
    this.client.replace(`/${Routes.SignIn}`);
  }
  toSignUp() {
    this.client.replace(`/${Routes.SignUp}`);
  }

  toSearch() {
    this.client.push(`/${Stacks.CreateTrip}/${Routes.Search}`);
  }
  toSelectTravelers() {
    this.client.push(`/${Stacks.CreateTrip}/${Routes.SelectTraveler}`);
  }
  toSelectDates() {
    this.client.push(`/${Stacks.CreateTrip}/${Routes.SelectDates}`);
  }
  toSelectBudget() {
    this.client.push(`/${Stacks.CreateTrip}/${Routes.SelectBudget}`);
  }
  toReviewTrip() {
    this.client.push(`/${Stacks.CreateTrip}/${Routes.ReviewTrip}`);
  }

  toGenerateTrip() {
    this.client.dismissAll();
    this.client.replace(`/${Stacks.CreateTrip}/${Routes.GenerateTrip}`);
  }

  toTripDetails({ id, fromGenerate }: { id: string; fromGenerate?: boolean }) {
    this.client.push({
      pathname: `/${Stacks.CreateTrip}/${Routes.TripDetails}`,
      params: { id, ...(fromGenerate && { fromGenerate: 'true' }) },
    });
  }

  toActivityDetails(params: { tripId: string; activityId: number }) {
    this.client.push({ pathname: `/${Stacks.CreateTrip}/${Routes.ActivityDetails}`, params });
  }

  toShowAllTrips() {
    this.client.push({ pathname: `/${Stacks.HomePage}/${Routes.ShowAllTrips}` });
  }
  toChangeLanguage() {
    this.client.push(`/${Stacks.Profile}/${Routes.ChangeLanguage}`);
  }

  back() {
    this.client.back();
  }

  replace(href: NavigationHref) {
    this.client.replace(href);
  }
}
