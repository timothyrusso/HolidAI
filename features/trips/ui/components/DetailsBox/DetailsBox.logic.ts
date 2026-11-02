import { translateDate } from '@/features/core/dates';
import { navigationService } from '@/features/core/navigation';
import { useLocale } from '@/features/core/translations';

export const useDetailsBoxLogic = (tripId: string, tripStartDate: string) => {
  const { locale } = useLocale();

  const handlePress = () => navigationService.toTripDetails({ id: tripId });

  const dateLabel = translateDate(locale, tripStartDate);

  const handleShowAllTripsButton = () => navigationService.toTripList();

  return {
    derived: { dateLabel },
    effects: { handlePress, handleShowAllTripsButton },
  };
};
