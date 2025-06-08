import { convertFromUTCToLocaleUseCase } from '@/modules/dates/application/convertFromUTCToLocaleUseCase';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
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

  const handlePress = () => {
    router.push({
      pathname: `/${Stacks.CreateTrip}/${Routes.TripDetails}`,
      params: { id: tripId },
    });
  };

  const budgetLabel = budget === 'MY_TRIP.BUDGET_NOT_AVAILABLE' ? t('MY_TRIP.BUDGET_NOT_AVAILABLE') : budget;

  const travelersLabel = travelers;
  const daysLabel = days;

  const dateLabel = convertFromUTCToLocaleUseCase(tripStartDate);

  return { handlePress, budgetLabel, travelersLabel, daysLabel, dateLabel };
};
