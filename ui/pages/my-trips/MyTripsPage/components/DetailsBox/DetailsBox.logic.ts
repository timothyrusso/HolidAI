import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import { useLocale } from '@/ui/hooks/useLocale';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
export const useDetailsBoxLogic = (
  tripId: string,
  tripStartDate: string,
  budget: string,
  travelers: number,
  days: number,
) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = useLocale();

  const handlePress = () => {
    router.push({
      pathname: `/${Stacks.CreateTrip}/${Routes.TripDetails}`,
      params: { id: tripId },
    });
  };

  const budgetLabel = budget === 'MY_TRIP.BUDGET_NOT_AVAILABLE' ? t('MY_TRIP.BUDGET_NOT_AVAILABLE') : budget;

  const travelersLabel = travelers;
  const daysLabel = days;

  const dateLabel = translateDate(locale, tripStartDate);

  const handleShowAllTripsButton = () => router.push({ pathname: `/${Stacks.MyTrips}/${Routes.ShowAllTrips}` });

  return { handlePress, budgetLabel, travelersLabel, daysLabel, dateLabel, handleShowAllTripsButton };
};
