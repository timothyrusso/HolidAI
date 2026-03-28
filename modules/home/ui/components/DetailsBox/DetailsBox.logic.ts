import { translateDateUseCase } from '@/features/core/dates';
import { useLocale } from '@/features/core/translations';
import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
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

  const dateLabel = translateDateUseCase.execute(locale, tripStartDate);

  const handleShowAllTripsButton = () => router.push({ pathname: `/${Stacks.HomePage}/${Routes.ShowAllTrips}` });

  return { handlePress, dateLabel, handleShowAllTripsButton };
};
