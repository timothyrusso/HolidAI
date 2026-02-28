import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import { useLocale } from '@/modules/shared/hooks/useLocale';
import { useRouter } from 'expo-router';

export const useDetailsBoxLogic = (tripId: string, tripStartDate: string) => {
  const router = useRouter();
  const { locale } = useLocale();

  const handlePress = () => {
    router.push({
      pathname: `/${Stacks.CreateTrip}/${Routes.TripDetails}`,
      params: { id: tripId },
    });
  };

  const dateLabel = translateDate(locale, tripStartDate);

  const handleShowAllTripsButton = () => router.push({ pathname: `/${Stacks.MyTrips}/${Routes.ShowAllTrips}` });

  return { handlePress, dateLabel, handleShowAllTripsButton };
};
