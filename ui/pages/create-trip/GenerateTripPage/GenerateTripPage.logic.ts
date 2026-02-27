import { logger } from '@/di/resolve';
import { ai_prompt } from '@/modules/ai/domain/entities/prompt';

import { api } from '@/convex/_generated/api';
import { AiModels } from '@/modules/ai/domain/entities/AiModels';
import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import { Routes } from '@/modules/navigation/domain/entities/routes';
import { generatedTripSchema } from '@/modules/trips/domain/entities/GenerateTripSchema';
import { useLocale } from '@/ui/hooks/useLocale';
import { useToast } from '@/ui/hooks/useToast';
import { useVercelAi } from '@/ui/hooks/useVercelAi';
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
  const { showToast } = useToast();

  const { decrementTokens } = useGetUserStatus();

  const { generateAiObject } = useVercelAi();

  const addTripToDb = useMutation(api.trips.createTrip);

  const totalNoOfDays = tripSelectors.datesInfo().totalNoOfDays;

  const PROMPT = ai_prompt
    .replace('{location}', tripSelectors.locationInfo().name)
    .replace('{days}', totalNoOfDays.toString())
    .replace('{nights}', (totalNoOfDays - 1).toString())
    .replace('{travelersNumber}', tripSelectors.travelersNumber().toString())
    .replace('{travelersType}', tripSelectors.travelerType())
    .replace('{budget}', tripSelectors.budgetInfo)
    .replace('{days}', totalNoOfDays.toString())
    .replace('{nights}', (totalNoOfDays - 1).toString())
    .replace('{startDate}', translateDate(locale, tripSelectors.datesInfo().startDate))
    .replace('{endDate}', translateDate(locale, tripSelectors.datesInfo().endDate))
    .replace('{locale}', locale);

  const generateAiTrip = async () => {
    setIsLoading(true);

    try {
      const output = await generateAiObject<typeof generatedTripSchema>(
        PROMPT,
        generatedTripSchema,
        AiModels.GEMINI_2_5_FLASH,
      );

      if (!output) {
        throw new Error('Failed to generate trip plan');
      }

      await addTripToDb({
        userId: userId || 'unknown_user',
        tripAiResp: output,
        isFavorite: false,
      });

      decrementTokens(totalNoOfDays);

      router.push(`/${Routes.MyTrips}`);
    } catch (error) {
      router.replace(`/${Routes.MyTrips}`);
      showToast('GENERATE_TRIP.ERROR');
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
