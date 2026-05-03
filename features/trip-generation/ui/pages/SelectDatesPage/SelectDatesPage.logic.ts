import {
  getTimezoneFormattedDateUseCase,
  getTodayInLocalTimezoneUseCase,
  translateDateUseCase,
} from '@/features/core/dates';
import { navigationService } from '@/features/core/navigation';
import { useLocale } from '@/features/core/translations';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { useGetUserTokens } from '@/features/user';
import { differenceInDays } from 'date-fns';
import { useState } from 'react';

export const useSelectDatesPageLogic = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarKey, setCalendarKey] = useState<number>(0); // To force re-render of CalendarPicker

  const { tripActions } = useTripGenerationState();
  const todayInLocalTimezone = getTodayInLocalTimezoneUseCase.execute();

  const handleDateChange = (date: Date, type?: 'START_DATE' | 'END_DATE') => {
    // The library's types declare date as Date, but passes null at runtime during
    // mid-range selection. The cast and null guard are intentional.
    const safeDate = date as Date | null;
    if (!safeDate) {
      if (type === 'START_DATE') setStartDate(null);
      if (type === 'END_DATE') setEndDate(null);
      return;
    }

    const timezoneFormattedDate = getTimezoneFormattedDateUseCase.execute(safeDate);

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
    navigationService.toSelectBudget();
  };

  const { locale } = useLocale();

  const { userTokens } = useGetUserTokens();

  const startDateLabel = translateDateUseCase.execute(locale, startDate);
  const endDateLabel = translateDateUseCase.execute(locale, endDate);

  const removeDates = () => {
    setStartDate(null);
    setEndDate(null);
    setCalendarKey(prev => prev + 1);
  };

  return {
    handleDateChange,
    handleButtonPress,
    todayInLocalTimezone,
    startDate,
    numberOfDays: calculateDifferenceInDays(),
    startDateLabel,
    endDateLabel,
    removeDates,
    calendarKey,
    userTokens,
  };
};
