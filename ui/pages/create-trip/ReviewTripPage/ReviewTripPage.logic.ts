import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useLocale } from '@/ui/hooks/useLocale';
import { useTripState } from '@/ui/state/trip';
import { useRouter } from 'expo-router';

export type TripRecap = {
  title: string;
  value: string;
  icon: string;
};
export const useReviewTripPageLogic = () => {
  const router = useRouter();
  const { tripSelectors } = useTripState();
  const { locale } = useLocale();

  const getTripDates = () => {
    const { startDate, endDate } = tripSelectors.datesInfo();
    return startDate && `${translateDate(locale, startDate)}${endDate ? ` - ${translateDate(locale, endDate)}` : ''}`;
  };

  const handleButtonPress = () => {
    router.dismissAll();
    router.replace(`/${Stacks.CreateTrip}/${Routes.GenerateTrip}`);
  };

  const animation = require('../../../assets/lottie/photo_animation.json');

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
