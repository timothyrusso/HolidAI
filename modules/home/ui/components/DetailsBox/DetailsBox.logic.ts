import { translateDateUseCase } from '@/features/core/dates';
import { navigationService } from '@/features/core/navigation';
import { useLocale } from '@/features/core/translations';

export const useDetailsBoxLogic = (tripId: string, tripStartDate: string) => {
  const { locale } = useLocale();

  const handlePress = () => navigationService.toTripDetails({ id: tripId });

  const dateLabel = translateDateUseCase.execute(locale, tripStartDate);

  const handleShowAllTripsButton = () => navigationService.toShowAllTrips();

  return { handlePress, dateLabel, handleShowAllTripsButton };
};
