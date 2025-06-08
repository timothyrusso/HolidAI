import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useTripState } from '@/ui/state/trip';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

export type TripRecap = {
  title: string;
  value: string;
  icon: string;
};
export const useReviewTripPageLogic = () => {
  const router = useRouter();
  const { tripSelectors } = useTripState();

  const getTripDates = () => {
    const { startDate, endDate } = tripSelectors.datesInfo();
    return startDate && `${format(startDate, 'dd MMM yyyy')}${endDate ? ` to ${format(endDate, 'dd MMM yy')}` : ''}`;
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
    travelers: tripSelectors.travelerInfo(),
    budget: tripSelectors.budgetInfo(),
    animation,
  };
};
