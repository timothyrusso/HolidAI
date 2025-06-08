import { getTimezoneFormattedDateUseCase } from '@/modules/dates/application/getTimezoneFormattedDateUseCase';
import { getTodayInLocalTimezoneUseCase } from '@/modules/dates/application/getTodayInLocalTimezoneUseCase';
import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useLocale } from '@/ui/hooks/useLocale';
import { useTripState } from '@/ui/state/trip';
import { differenceInDays } from 'date-fns';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useSelectDatesPageLogic = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { tripActions } = useTripState();
  const router = useRouter();
  const todayInLocalTimezone = getTodayInLocalTimezoneUseCase;

  const handleDateChange = (date: Date, type: string) => {
    const timezoneFormattedDate = getTimezoneFormattedDateUseCase(date);

    if (type === 'START_DATE') {
      setStartDate(timezoneFormattedDate);
    } else if (type === 'END_DATE') {
      setEndDate(timezoneFormattedDate);
    }
  };

  const calculateDifferenceInDays = (): number => {
    if (!startDate) return 0;
    if (!endDate) return 1;
    return differenceInDays(endDate, startDate) + 1;
  };

  const handleButtonPress = () => {
    tripActions.setDatesInfo({
      startDate,
      endDate,
      totalNoOfDays: calculateDifferenceInDays(),
    });
    router.push(`/${Stacks.CreateTrip}/${Routes.SelectBudget}`);
  };

  const { locale } = useLocale();

  const startDateLabel = `${translateDate(locale, startDate)}`;
  const endDateLabel = `${translateDate(locale, endDate)}`;

  return {
    handleDateChange,
    handleButtonPress,
    todayInLocalTimezone,
    startDate,
    numberOfDays: calculateDifferenceInDays(),
    startDateLabel,
    endDateLabel,
  };
};
