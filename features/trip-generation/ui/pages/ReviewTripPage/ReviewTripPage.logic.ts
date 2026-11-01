import { translateDate } from '@/features/core/dates';
import { navigationService } from '@/features/core/navigation';
import { useLocale } from '@/features/core/translations';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';

export type TripRecap = {
  title: string;
  value: string;
  icon: string;
};

const animation = require('@/features/core/design-system/assets/lottie/photo_animation.json');

export const useReviewTripPageLogic = () => {
  const { tripSelectors } = useTripGenerationState();
  const { locale } = useLocale();

  const getTripDates = () => {
    const { startDate, endDate } = tripSelectors.datesInfo();
    return startDate && `${translateDate(locale, startDate)}${endDate ? ` - ${translateDate(locale, endDate)}` : ''}`;
  };

  const handleButtonPress = () => {
    navigationService.toGenerateTrip();
  };

  return {
    state: {
      travelers: {
        travelersNumber: tripSelectors.travelersNumber(),
        travelersType: tripSelectors.travelerType(),
      },
      budget: tripSelectors.budgetInfo(),
      animation,
    },
    derived: {
      destination: tripSelectors.locationInfo().name.split(',')[0],
      dates: getTripDates() ?? '',
    },
    effects: {
      handleButtonPress,
    },
  };
};
