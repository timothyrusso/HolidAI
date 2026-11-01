import { useUser } from '@clerk/expo';
import { useEffect, useState } from 'react';
import { BaseError, ErrorCode } from '@/features/core/error';
import { navigationService } from '@/features/core/navigation';
import { useToast } from '@/features/core/toast';
import { useLocale } from '@/features/core/translations';
import {
  enrichDishesWithImagesUseCase,
  enrichTripWithCoverImageUseCase,
  enrichTripWithPhotosUseCase,
} from '@/features/trip-generation/di/resolve';
import { useGenerateTrip } from '@/features/trip-generation/facades/useGenerateTrip';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { type TripAiResp, useAddTrip } from '@/features/trips';
import { useDecrementTokens, useGetUserTokens } from '@/features/user';

export const useGenerateTripPageLogic = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { tripSelectors } = useTripGenerationState();
  const { user } = useUser();
  const { locale } = useLocale();
  // NOTE: accepted exception to the "toast in facades" rule.
  const { showErrorToast } = useToast();
  const { generate } = useGenerateTrip();
  const { addTrip } = useAddTrip();
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

  const saveTrip = async (trip: TripAiResp) => {
    const [photosResult, dishesResult, coverResult] = await Promise.all([
      enrichTripWithPhotosUseCase.execute(trip),
      enrichDishesWithImagesUseCase.execute(trip),
      enrichTripWithCoverImageUseCase.execute(trip),
    ]);

    const enrichedData = {
      ...(photosResult.success ? photosResult.data : trip),
      food: dishesResult.success ? dishesResult.data.food : trip.food,
      coverImage: coverResult.success ? coverResult.data.coverImage : { url: '', blurHash: '' },
    };

    const addTripResult = await addTrip({
      userId: user?.id ?? 'unknown_user',
      tripAiResp: enrichedData,
      isFavorite: false,
    });

    if (!addTripResult.success) {
      showErrorToast(addTripResult.error);
      leave();
      return;
    }

    decrementTokens(datesInfo.totalNoOfDays);
    setIsLoading(false);
    navigationService.toTripDetails({ id: addTripResult.data, fromGenerate: true });
  };

  const generateTrip = () => {
    if (userTokens === 0) {
      showErrorToast(new BaseError('No tokens remaining', ErrorCode.TokensExhausted));
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
      { onSuccess: saveTrip, onError: leave },
    );
  };

  useEffect(() => {
    generateTrip();
  }, []);

  return { state: { isLoading } };
};
