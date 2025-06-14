import { chatSession } from '@/configs/ai/geminiConfig';
// FIXME: react-native-get-random-values must be imported before nanoid
import { ai_prompt } from '@/configs/ai/prompt';
import { db } from '@/configs/firebaseConfig';
import { logger } from '@/di/resolve';

import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import { dbKeys } from '@/modules/trip/domain/entities/DbKeys';
import { Routes } from '@/ui/constants/navigation/routes';
import { useLocale } from '@/ui/hooks/useLocale';
import { useToast } from '@/ui/hooks/useToast';
import { tripsKeys } from '@/ui/queries/trips/TripsKeys';
import { useTripState } from '@/ui/state/trip';
import { useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';

export const useGenerateTripPageLogic = () => {
  const { tripSelectors } = useTripState();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  const { locale } = useLocale();
  const { showToast } = useToast();

  const queryClient = useQueryClient();

  const PROMPT = ai_prompt
    .replace('{location}', tripSelectors.locationInfo().name)
    .replace('{days}', tripSelectors.datesInfo().totalNoOfDays.toString())
    .replace('{nights}', (tripSelectors.datesInfo().totalNoOfDays - 1).toString())
    .replace('{travelersNumber}', tripSelectors.travelersNumber().toString())
    .replace('{travelersType}', tripSelectors.travelerType())
    .replace('{budget}', tripSelectors.budgetInfo)
    .replace('{days}', tripSelectors.datesInfo().totalNoOfDays.toString())
    .replace('{nights}', (tripSelectors.datesInfo().totalNoOfDays - 1).toString())
    .replace('{startDate}', translateDate(locale, tripSelectors.datesInfo().startDate))
    .replace('{endDate}', translateDate(locale, tripSelectors.datesInfo().endDate))
    .replace('{locale}', locale);

  const generateAiTrip = async () => {
    setIsLoading(true);

    try {
      const resultPrompt = await chatSession.sendMessage(PROMPT);
      const responseText = await resultPrompt.response.text();

      const docId = nanoid();

      const tripAiResp = JSON.parse(responseText);

      await setDoc(doc(db, `${dbKeys.userTrips}/${userId}/trips`, docId), {
        tripAiResp,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        docId,
      });

      queryClient.invalidateQueries({ queryKey: [tripsKeys.getUserTrips] });

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
