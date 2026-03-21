import { api } from '@/convex/_generated/api';
import { AiModels, travelPlanPrompt } from '@/features/ai';
import { formatDateForPromptUseCase } from '@/features/core/dates';
import { ensureError, logger } from '@/features/core/error';
import { useToast } from '@/features/core/toast';
import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import { useLocale } from '@/modules/shared/hooks/useLocale';
import { useVercelAi } from '@/modules/shared/hooks/useVercelAi';
import { generatedTripSchema } from '@/modules/trips/domain/entities/GenerateTripSchema';
import { useGetUserStatus } from '@/ui/queries/user/query/useGetUserStatus';
import { useTripState } from '@/ui/state/trip';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export const useGenerateTripPageLogic = () => {
  const { tripSelectors } = useTripState();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  const { locale } = useLocale();
  const { showErrorToast } = useToast();

  const { decrementTokens } = useGetUserStatus();

  const { generateAiObject } = useVercelAi();

  const addTripToDb = useMutation(api.trips.createTrip);

  const totalNoOfDays = tripSelectors.datesInfo().totalNoOfDays;

  const PROMPT = travelPlanPrompt
    .replace('{location}', tripSelectors.locationInfo().name)
    .replace('{days}', totalNoOfDays.toString())
    .replace('{nights}', (totalNoOfDays - 1).toString())
    .replace('{travelersNumber}', tripSelectors.travelersNumber().toString())
    .replace('{travelersType}', tripSelectors.travelerType())
    .replace('{budget}', tripSelectors.budgetInfo)
    .replace('{days}', totalNoOfDays.toString())
    .replace('{nights}', (totalNoOfDays - 1).toString())
    .replace('{startDate}', formatDateForPromptUseCase.execute(tripSelectors.datesInfo().startDate))
    .replace('{endDate}', formatDateForPromptUseCase.execute(tripSelectors.datesInfo().endDate))
    .replace('{locale}', locale);

  const generateAiTrip = async () => {
    setIsLoading(true);

    try {
      const output = await generateAiObject<typeof generatedTripSchema>(
        PROMPT,
        generatedTripSchema,
        AiModels.GEMINI_2_5_FLASH,
      );

      const tripId = await addTripToDb({
        userId: userId || 'unknown_user',
        tripAiResp: output,
        isFavorite: false,
      });

      decrementTokens(totalNoOfDays);

      router.push({
        pathname: `/${Stacks.CreateTrip}/${Routes.TripDetails}`,
        params: { id: tripId, fromGenerate: 'true' },
      });
    } catch (error) {
      router.replace(`/${Routes.HomePage}`);
      showErrorToast(ensureError(error));
      logger.error(new Error('Error generating AI trip:'), error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAiTrip();
  }, []);

  return { generateAiTrip, isLoading };
};
