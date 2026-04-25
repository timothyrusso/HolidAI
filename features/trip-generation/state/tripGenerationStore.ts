import { createSelectors } from '@/features/core/state/libraries/createSelectors';
import { registerStore } from '@/features/core/state/libraries/createStore';
import { createZustandStorage } from '@/features/core/state/libraries/createZustandStorage';
import type { IStorage } from '@/features/core/storage';
import { storage as defaultStorage } from '@/features/core/storage';
import type { DatesInfo } from '@/features/trip-generation/domain/entities/DatesInfo';
import type { LocationInfo } from '@/features/trip-generation/domain/entities/LocationInfo';
import { clearExpiredDates } from '@/features/trip-generation/state/clearExpiredDates';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export type TripGenerationState = {
  locationInfo: LocationInfo;
  travelerType: string;
  travelersNumber: number;
  datesInfo: DatesInfo;
  budgetInfo: string;
};

export type TripGenerationActions = {
  actions: {
    setLocationInfo: (locationInfo: LocationInfo) => void;
    setTravelerType: (travelerType: string) => void;
    setTravelersNumber: (travelersNumber: number) => void;
    setDatesInfo: (datesInfo: DatesInfo) => void;
    setBudgetInfo: (budgetInfo: string) => void;
    resetTripGenerationState: () => void;
  };
};

const initialState: TripGenerationState = {
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

export const createTripGenerationStore = (storageClient: IStorage = defaultStorage) =>
  createWithEqualityFn<TripGenerationState & TripGenerationActions>()(
    persist(
      set => ({
        ...initialState,
        actions: {
          setLocationInfo: locationInfo => set({ locationInfo }),
          setTravelerType: travelerType => set({ travelerType }),
          setTravelersNumber: travelersNumber => set({ travelersNumber }),
          setDatesInfo: datesInfo => set({ datesInfo }),
          setBudgetInfo: budgetInfo => set({ budgetInfo }),
          resetTripGenerationState: () => set(initialState),
        },
      }),
      {
        name: 'trip-generation-store',
        version: 1,
        migrate: () => initialState,
        storage: createZustandStorage(storageClient),
        partialize: ({ locationInfo, travelerType, travelersNumber, datesInfo, budgetInfo }) => ({
          locationInfo,
          travelerType,
          travelersNumber,
          datesInfo,
          budgetInfo,
        }),
        onRehydrateStorage: () => state => {
          if (state && clearExpiredDates(state.datesInfo)) {
            state.datesInfo = initialState.datesInfo;
          }
        },
      },
    ),
    shallow,
  );

export const useTripGenerationStore = createTripGenerationStore();
export const tripGenerationStoreSelectors = createSelectors(useTripGenerationStore);
registerStore(useTripGenerationStore);
