import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { registerStore } from '@/features/core/state';
import type { TripActions, TripState } from './types';

const initialState: TripState = {
  locationInfo: {
    name: '',
    coordinates: undefined,
    photoRef: '',
    url: '',
  },
  travelerType: '',
  travelersNumber: 1,
  datesInfo: {
    startDate: null,
    endDate: null,
    totalNoOfDays: 0,
  },
  budgetInfo: 'Cheap',
};

const createTripStore = () =>
  createWithEqualityFn<TripState & TripActions>()(
    set => ({
      ...initialState,
      actions: {
        setLocationInfo: locationInfo => set({ locationInfo }),
        setTravelerType: travelerType => set({ travelerType }),
        setTravelersNumber: travelersNumber => set({ travelersNumber }),
        setDatesInfo: datesInfo => set({ datesInfo }),
        setBudgetInfo: budgetInfo => set({ budgetInfo }),
        resetTripState: () => set(initialState),
      },
    }),
    shallow,
  );

export const useTripStore = createTripStore();
registerStore(useTripStore);
