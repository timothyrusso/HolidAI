import { createTripGenerationStore } from '@/features/trip-generation/state/tripGenerationStore';

const KYOTO = { name: 'Kyoto, Japan', coordinates: { lat: 35.0116, lng: 135.7681 }, photoRef: 'ref', url: 'url' };
const MAY = { startDate: new Date('2026-05-12'), endDate: new Date('2026-05-15'), totalNoOfDays: 4 };

describe('tripGenerationStore', () => {
  it('starts with an empty wizard for one traveler', () => {
    const store = createTripGenerationStore();

    expect(store.getState()).toMatchObject({ travelerType: '', travelersNumber: 1, budgetInfo: '' });
  });

  it('keeps each answer of the wizard', () => {
    const store = createTripGenerationStore();
    const set = store.getState().actions;

    set.setLocationInfo(KYOTO);
    set.setTravelerType('Couple');
    set.setTravelersNumber(2);
    set.setDatesInfo(MAY);
    set.setBudgetInfo('Moderate');

    expect(store.getState()).toMatchObject({
      locationInfo: KYOTO,
      travelerType: 'Couple',
      travelersNumber: 2,
      datesInfo: MAY,
      budgetInfo: 'Moderate',
    });
  });

  it('clears every answer on reset', () => {
    const store = createTripGenerationStore();
    store.getState().actions.setBudgetInfo('Moderate');
    store.getState().actions.setTravelersNumber(3);

    store.getState().actions.resetTripGenerationState();

    expect(store.getState()).toMatchObject({ travelersNumber: 1, budgetInfo: '' });
  });
});
