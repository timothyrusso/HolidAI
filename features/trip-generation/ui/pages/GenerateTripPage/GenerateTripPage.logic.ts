import { navigationService } from '@/features/core/navigation';
import { useToast } from '@/features/core/toast';
import { useLocale } from '@/features/core/translations';
import { useDecrementTokens } from '@/features/profile';
import { generateTripUseCase } from '@/features/trip-generation';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { useAddTrip } from '@/features/trips';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';

export const useGenerateTripPageLogic = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { tripSelectors, tripActions } = useTripGenerationState();
  const { user } = useUser();
  const { locale } = useLocale();
  const { showErrorToast } = useToast();
  const { addTrip } = useAddTrip();
  const { decrementTokens } = useDecrementTokens();

  const datesInfo = tripSelectors.datesInfo();
  const locationInfo = tripSelectors.locationInfo();
  const travelersNumber = tripSelectors.travelersNumber();
  const travelerType = tripSelectors.travelerType();
  const budgetInfo = tripSelectors.budgetInfo();

  const generateTrip = async () => {
    const result = await generateTripUseCase.execute({
      location: locationInfo.name,
      totalNoOfDays: datesInfo.totalNoOfDays,
      travelersNumber,
      travelerType,
      budgetInfo,
      startDate: datesInfo.startDate as Date,
      endDate: datesInfo.endDate as Date,
      locale,
    });

    if (!result.success) {
      navigationService.toHome();
      showErrorToast(result.error);
      setIsLoading(false);
      return;
    }

    const addTripResult = await addTrip({
      userId: user?.id ?? 'unknown_user',
      tripAiResp: result.data,
      isFavorite: false,
    });

    if (!addTripResult.success) {
      navigationService.toHome();
      showErrorToast(addTripResult.error);
      setIsLoading(false);
      return;
    }

    decrementTokens(datesInfo.totalNoOfDays);
    tripActions.resetTripGenerationState();
    setIsLoading(false);
    navigationService.toTripDetails({ id: addTripResult.data, fromGenerate: true });
  };

  useEffect(() => {
    generateTrip();
  }, []);

  return { isLoading };
};
