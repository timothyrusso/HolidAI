import { chatSession } from '@/configs/ai/geminiConfig';
// FIXME: react-native-get-random-values must be imported before nanoid
import { ai_prompt } from '@/configs/ai/prompt';
import { db } from '@/configs/firebaseConfig';
import { logger } from '@/di/resolve';

import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import { dbKeys } from '@/modules/trip/domain/entities/DbKeys';
import { Routes } from '@/ui/constants/routes';
import { useLocale } from '@/ui/hooks/useLocale';
import { useTripState } from '@/ui/state/trip';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';

export const useGenerateTripPageLogic = () => {
  const { tripSelectors } = useTripState();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const userId = auth().currentUser?.uid;
  const { locale } = useLocale();

  const userTripData = {
    startDate: tripSelectors.datesInfo().startDate,
    endDate: tripSelectors.datesInfo().endDate,
    location: tripSelectors.locationInfo().name,
    days: tripSelectors.datesInfo().totalNoOfDays.toString(),
    nights: (tripSelectors.datesInfo().totalNoOfDays - 1).toString(),
    traveler: tripSelectors.travelerInfo,
    budget: tripSelectors.budgetInfo,
    isFavorite: false,
    createdAt: new Date().toISOString(),
  };

  const PROMPT = ai_prompt
    .replace('{location}', userTripData.location)
    .replace('{days}', userTripData.days)
    .replace('{nights}', userTripData.nights)
    .replace('{traveler}', userTripData.traveler)
    .replace('{budget}', userTripData.budget)
    .replace('{days}', userTripData.days)
    .replace('{nights}', userTripData.nights)
    .replace('{startDate}', translateDate(locale, userTripData.startDate))
    .replace('{endDate}', translateDate(locale, userTripData.endDate))
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
        userTripData: JSON.stringify(userTripData),
        docId,
      });

      router.push(`/${Routes.MyTrips}`);
    } catch (error) {
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
