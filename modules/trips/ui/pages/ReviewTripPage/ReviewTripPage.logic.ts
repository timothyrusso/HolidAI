import { translateDateUseCase } from '@/features/core/dates';
import { navigationService } from '@/features/core/navigation';
import { useLocale } from '@/features/core/translations';
import { useTripState } from '@/ui/state/trip';

export type TripRecap = {
  title: string;
  value: string;
  icon: string;
};
export const useReviewTripPageLogic = () => {
  const { tripSelectors } = useTripState();
  const { locale } = useLocale();

  const getTripDates = () => {
    const { startDate, endDate } = tripSelectors.datesInfo();
    return (
      startDate &&
      `${translateDateUseCase.execute(locale, startDate)}${endDate ? ` - ${translateDateUseCase.execute(locale, endDate)}` : ''}`
    );
  };

  const handleButtonPress = () => {
    navigationService.toGenerateTrip();
  };

  const animation = require('@/ui/assets/lottie/photo_animation.json');

  return {
    handleButtonPress,
    destination: tripSelectors.locationInfo().name.split(',')[0],
    dates: getTripDates() ?? '',
    travelers: {
      travelersNumber: tripSelectors.travelersNumber(),
      travelersType: tripSelectors.travelerType(),
    },
    budget: tripSelectors.budgetInfo(),
    animation,
  };
};
