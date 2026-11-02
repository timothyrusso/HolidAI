import { useEffect, useState } from 'react';
import { navigationService } from '@/features/core/navigation';
import { useToast } from '@/features/core/toast';
import { useLocale } from '@/features/core/translations';
import { useGenerateTrip } from '@/features/trip-generation/facades/useGenerateTrip';
import { useSaveTrip } from '@/features/trip-generation/facades/useSaveTrip';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { TokensExhausted, useDecrementTokens, useGetUserTokens } from '@/features/user';

export const useGenerateTripPageLogic = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { tripSelectors } = useTripGenerationState();
  const { locale } = useLocale();
  // NOTE: accepted exception to the "toast in facades" rule.
  const { showErrorToast } = useToast();
  const { generate } = useGenerateTrip();
  const { save } = useSaveTrip();
  const { decrementTokens } = useDecrementTokens();
  const { userTokens } = useGetUserTokens();

  const datesInfo = tripSelectors.datesInfo();
  const locationInfo = tripSelectors.locationInfo();
  const travelersNumber = tripSelectors.travelersNumber();
  const travelerType = tripSelectors.travelerType();
  const budgetInfo = tripSelectors.budgetInfo();

  const leave = () => {
    navigationService.toHome();
    setIsLoading(false);
  };

  const showTrip = (id: string) => {
    decrementTokens(datesInfo.totalNoOfDays);
    setIsLoading(false);
    navigationService.toTripDetails({ id, fromGenerate: true });
  };

  const generateTrip = () => {
    if (userTokens === 0) {
      showErrorToast(new TokensExhausted());
      navigationService.toHome();
      return;
    }

    generate(
      {
        location: locationInfo.name,
        totalNoOfDays: datesInfo.totalNoOfDays,
        travelersNumber,
        travelerType,
        budgetInfo,
        startDate: datesInfo.startDate as Date,
        endDate: datesInfo.endDate as Date,
        locale,
      },
      { onSuccess: trip => save(trip, { onSuccess: showTrip, onError: leave }), onError: leave },
    );
  };

  useEffect(() => {
    generateTrip();
  }, []);

  return { state: { isLoading } };
};
