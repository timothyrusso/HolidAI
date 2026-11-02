import { act } from '@testing-library/react-native';
import { api } from '@/convex/_generated/api';
import { clerkFake, convexFake, NoFeatures, renderWithLayer, routerFake } from '@/features/core/testing';
import { useTripGenerationStore } from '@/features/trip-generation/state/tripGenerationStore';
import { useTravelersNumberSelectorLogic } from '@/features/trip-generation/ui/components/TravelersNumberSelector/TravelersNumberSelector.logic';
import { useReviewTripPageLogic } from '@/features/trip-generation/ui/pages/ReviewTripPage/ReviewTripPage.logic';
import { useSearchPlacePageLogic } from '@/features/trip-generation/ui/pages/SearchPlacePage/SearchPlacePage.logic';
import { useSelectBudgetPageLogic } from '@/features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage.logic';
import { useSelectDatesPageLogic } from '@/features/trip-generation/ui/pages/SelectDatesPage/SelectDatesPage.logic';
import { useSelectTravelersPageLogic } from '@/features/trip-generation/ui/pages/SelectTravelersPage/SelectTravelersPage.logic';

const KYOTO = { name: 'Kyoto, Japan', coordinates: undefined, photoRef: 'ref', url: 'https://maps.google.com/kyoto' };
const wizard = () => useTripGenerationStore.getState();
const pickedOn = (year: number, month: number, day: number) => new Date(year, month - 1, day, 12);

afterEach(() => {
  useTripGenerationStore.getState().actions.resetTripGenerationState();
});

describe('useSearchPlacePageLogic', () => {
  it('keeps the next step disabled until a place is picked', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useSearchPlacePageLogic, undefined);

    expect(result.current.derived.isButtonDisabled).toBe(true);
    await done();
  });

  it('remembers the place picked and enables the next step', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useSearchPlacePageLogic, undefined);

    await act(async () => result.current.effects.handleSearchPress(KYOTO));

    expect(wizard().locationInfo).toEqual(KYOTO);
    expect(result.current.derived.isButtonDisabled).toBe(false);
    await done();
  });

  it('goes on to the travelers', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useSearchPlacePageLogic, undefined);

    result.current.effects.handleParticipantsPress();

    expect(routerFake.history).toEqual([{ verb: 'push', href: '/create-trip/select-traveler' }]);
    await done();
  });
});

describe('useSelectTravelersPageLogic', () => {
  it('remembers the kind of travelers picked', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useSelectTravelersPageLogic, undefined);

    await act(async () => result.current.derived.options[1]?.onPress());

    expect(result.current.state.selectedTravelers).toBe(1);
    expect(wizard().travelerType).toBe('SELECT_TRAVELERS.COUPLE');
    await done();
  });

  it('goes on to the dates with the first kind when none was picked', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useSelectTravelersPageLogic, undefined);

    result.current.effects.handleButtonPress();

    expect(wizard().travelerType).toBe('SELECT_TRAVELERS.SINGLE');
    expect(routerFake.history).toEqual([{ verb: 'push', href: '/create-trip/select-dates' }]);
    await done();
  });
});

describe('useTravelersNumberSelectorLogic', () => {
  it('offers one to ten travelers and remembers the number picked', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useTravelersNumberSelectorLogic, undefined);

    await act(async () => result.current.derived.options[2]?.onPress());

    expect(result.current.derived.options.map(option => option.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.current.state.travelersNumber).toBe(3);
    await done();
  });
});

describe('useSelectBudgetPageLogic', () => {
  it('remembers the budget picked', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useSelectBudgetPageLogic, undefined);

    await act(async () => result.current.derived.options[2]?.onPress());

    expect(result.current.state.selectedBudget).toBe(2);
    expect(wizard().budgetInfo).toBe('SELECT_BUDGET.MODERATE');
    await done();
  });

  it('goes on to the review with the budget picked', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useSelectBudgetPageLogic, undefined);

    result.current.effects.handleButtonPress();

    expect(wizard().budgetInfo).toBe('SELECT_BUDGET.BASIC');
    expect(routerFake.history).toEqual([{ verb: 'push', href: '/create-trip/review-trip' }]);
    await done();
  });
});

describe('useSelectDatesPageLogic', () => {
  const renderDates = async () => {
    clerkFake.signIn();
    convexFake.setQuery(api.users.getUserTokens, () => 6);
    return renderWithLayer(NoFeatures, useSelectDatesPageLogic, undefined);
  };

  it('counts no day before a start is picked, and shows the tokens left', async () => {
    const { result, done } = await renderDates();

    expect(result.current.derived.numberOfDays).toBe(0);
    expect(result.current.state.userTokens).toBe(6);
    await done();
  });

  it('counts one day for a start with no end', async () => {
    const { result, done } = await renderDates();

    await act(async () => result.current.effects.handleDateChange(pickedOn(2026, 5, 12), 'START_DATE'));

    expect(result.current.derived.numberOfDays).toBe(1);
    expect(result.current.derived.startDateLabel).toBe('5/12/2026');
    await done();
  });

  it('counts the days of the range, both ends included', async () => {
    const { result, done } = await renderDates();

    await act(async () => result.current.effects.handleDateChange(pickedOn(2026, 5, 12), 'START_DATE'));
    await act(async () => result.current.effects.handleDateChange(pickedOn(2026, 5, 15), 'END_DATE'));

    expect(result.current.derived.numberOfDays).toBe(4);
    expect(result.current.derived.endDateLabel).toBe('5/15/2026');
    await done();
  });

  it('clears an end the calendar unsets mid-selection', async () => {
    const { result, done } = await renderDates();

    await act(async () => result.current.effects.handleDateChange(pickedOn(2026, 5, 12), 'START_DATE'));
    await act(async () => result.current.effects.handleDateChange(pickedOn(2026, 5, 15), 'END_DATE'));
    await act(async () => result.current.effects.handleDateChange(null as unknown as Date, 'END_DATE'));

    expect(result.current.derived.numberOfDays).toBe(1);
    await done();
  });

  it('clears both dates and redraws the calendar', async () => {
    const { result, done } = await renderDates();

    await act(async () => result.current.effects.handleDateChange(pickedOn(2026, 5, 12), 'START_DATE'));
    await act(async () => result.current.effects.removeDates());

    expect(result.current.state.startDate).toBeNull();
    expect(result.current.state.calendarKey).toBe(1);
    await done();
  });

  it('goes on to the budget with the dates and their length', async () => {
    const { result, done } = await renderDates();

    await act(async () => result.current.effects.handleDateChange(pickedOn(2026, 5, 12), 'START_DATE'));
    await act(async () => result.current.effects.handleDateChange(pickedOn(2026, 5, 13), 'END_DATE'));
    result.current.effects.handleButtonPress();

    expect(wizard().datesInfo.totalNoOfDays).toBe(2);
    expect(routerFake.history).toEqual([{ verb: 'push', href: '/create-trip/select-budget' }]);
    await done();
  });
});

describe('useReviewTripPageLogic', () => {
  it('sums up the wizard: destination city, dates, travelers and budget', async () => {
    useTripGenerationStore.setState({
      locationInfo: KYOTO,
      travelerType: 'Couple',
      travelersNumber: 2,
      datesInfo: { startDate: pickedOn(2026, 5, 12), endDate: pickedOn(2026, 5, 15), totalNoOfDays: 4 },
      budgetInfo: 'Moderate',
    });
    const { result, done } = await renderWithLayer(NoFeatures, useReviewTripPageLogic, undefined);

    expect(result.current.derived).toEqual({ destination: 'Kyoto', dates: '5/12/2026 - 5/15/2026' });
    expect(result.current.state).toMatchObject({
      travelers: { travelersNumber: 2, travelersType: 'Couple' },
      budget: 'Moderate',
    });
    await done();
  });

  it('shows the start alone for a one-day trip', async () => {
    useTripGenerationStore.setState({
      datesInfo: { startDate: pickedOn(2026, 5, 12), endDate: null, totalNoOfDays: 1 },
    });
    const { result, done } = await renderWithLayer(NoFeatures, useReviewTripPageLogic, undefined);

    expect(result.current.derived.dates).toBe('5/12/2026');
    await done();
  });

  it('starts the generation', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useReviewTripPageLogic, undefined);

    result.current.effects.handleButtonPress();

    expect(routerFake.history).toEqual([
      { verb: 'dismiss', href: null },
      { verb: 'replace', href: '/create-trip/generate-trip' },
    ]);
    await done();
  });
});
