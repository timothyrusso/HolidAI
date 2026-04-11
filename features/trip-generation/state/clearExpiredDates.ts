import { getTodayInLocalTimezoneUseCase } from '@/features/core/dates';
import type { DatesInfo } from '@/features/trip-generation/domain/entities/DatesInfo';

/**
 * Returns true if datesInfo has a startDate that is in the past.
 * Called in onRehydrateStorage to clear stale trip wizard dates after app restart.
 * Handles string values because Zustand's persist middleware deserializes Date → string via JSON.
 */
export const clearExpiredDates = (datesInfo: DatesInfo): boolean => {
  if (!datesInfo.startDate) return false;
  const today = getTodayInLocalTimezoneUseCase.execute();
  // After JSON deserialization, Date objects come back as strings
  const startDate = new Date(datesInfo.startDate as unknown as string);
  return startDate < today;
};
