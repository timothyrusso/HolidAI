import type { DatesInfo } from '@/modules/trip/domain/entities/DatesInfo';
import type { LocationInfo } from '@/modules/trip/domain/entities/LocationInfo';

export type TripState = {
  locationInfo: LocationInfo;
  travelerType: string;
  travelersNumber: number;
  datesInfo: DatesInfo;
  budgetInfo: string;
};

export type TripActions = {
  actions: {
    setLocationInfo: (locationInfo: LocationInfo) => void;
    setTravelerType: (travelerType: string) => void;
    setTravelersNumber: (travelersNumber: number) => void;
    setDatesInfo: (datesInfo: DatesInfo) => void;
    setBudgetInfo: (budgetInfo: string) => void;
    resetTripState: () => void;
  };
};
