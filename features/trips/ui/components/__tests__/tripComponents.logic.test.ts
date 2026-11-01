import { waitFor } from '@testing-library/react-native';
import { api } from '@/convex/_generated/api';
import { clerkFake, convexFake, NoFeatures, renderWithLayer, routerFake } from '@/features/core/testing';
import { aDish, anActivity, aTrip, aTripAiResp } from '@/features/trips/__fixtures__/builders';
import { TripImagesFake } from '@/features/trips/di/__tests__/tripImagesFake';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useActivityItemLogic } from '@/features/trips/ui/components/ActivityItem/ActivityItem.logic';
import { useDetailsBoxLogic } from '@/features/trips/ui/components/DetailsBox/DetailsBox.logic';
import { useDishItemLogic } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem.logic';
import { useFoodCardLogic } from '@/features/trips/ui/components/FoodCard/FoodCard.logic';
import { useMainListItemLogic } from '@/features/trips/ui/components/MainPlacesList/components/MainListItem/MainListItem.logic';
import { useMainPlacesListLogic } from '@/features/trips/ui/components/MainPlacesList/MainPlacesList.logic';
import { useStartNewTripCardLogic } from '@/features/trips/ui/components/StartNewTripCard/StartNewTripCard.logic';
import { useTripCardLogic } from '@/features/trips/ui/components/TripCard/TripCard.logic';
import { useTripDetailsCardLogic } from '@/features/trips/ui/components/TripDetailsCard/TripDetailsCard.logic';
import { useTypicalDishesModalHeaderLogic } from '@/features/trips/ui/components/TypicalDishesModalHeader/TypicalDishesModalHeader.logic';

const images = TripImagesFake();

const useActivity = (activity: ReturnType<typeof anActivity>) => useActivityItemLogic(activity, 'trip_lisbon', 'EUR');

describe('useActivityItemLogic', () => {
  it('prices a paid activity in the trip currency', async () => {
    const { result, done } = await renderWithLayer(images, useActivity, anActivity());

    expect(result.current.derived).toMatchObject({ priceLabel: '10 EUR', rating: '4.6' });
    await done();
  });

  it('labels a free activity as free', async () => {
    const { result, done } = await renderWithLayer(images, useActivity, anActivity({ ticketPricing: 0 }));

    expect(result.current.derived.priceLabel).toBe('ACTIVITY_DETAILS.FREE');
    await done();
  });

  it('shows no price when the price is unknown', async () => {
    const { result, done } = await renderWithLayer(images, useActivity, anActivity({ ticketPricing: null }));

    expect(result.current.derived.priceLabel).toBeNull();
    await done();
  });

  it('shows the first photo of the activity', async () => {
    const { result, done } = await renderWithLayer(images, useActivity, anActivity());

    await waitFor(() => expect(result.current.derived.image).toContain('places/ChIJ1/photos/AU1/media'));
    await done();
  });

  it('opens the activity', async () => {
    const { result, done } = await renderWithLayer(images, useActivity, anActivity());

    result.current.effects.handlePress();

    expect(routerFake.history).toEqual([
      {
        verb: 'push',
        href: { pathname: '/create-trip/activity-details', params: { tripId: 'trip_lisbon', activityId: 1 } },
      },
    ]);
    await done();
  });
});

describe('useMainListItemLogic', () => {
  it('shows a thumbnail of the place', async () => {
    const { result, done } = await renderWithLayer(images, useMainListItemLogic, 'places/ChIJ1/photos/AU1');

    await waitFor(() => expect(result.current.derived.data).toContain('maxWidthPx=50'));
    await done();
  });

  it('shows no thumbnail for a place with no photo', async () => {
    const { result, done } = await renderWithLayer(images, useMainListItemLogic, undefined);

    expect(result.current.derived.data).toBeUndefined();
    await done();
  });
});

describe('useMainPlacesListLogic', () => {
  it("lists the first places of the next trip's first day, then a last item", async () => {
    clerkFake.signIn();
    TripsBackendFake([
      aTrip({
        tripAiResp: { ...aTripAiResp(), tripDetails: { ...aTripAiResp().tripDetails, startDate: '2099-01-01' } },
      }),
    ]);
    const { result, done } = await renderWithLayer(NoFeatures, useMainPlacesListLogic, undefined);

    expect(result.current.derived.listItems).toEqual([
      { id: 'Jerónimos Monastery', photoResourceName: 'places/ChIJ1/photos/AU1' },
      { id: 'Belém Tower', photoResourceName: 'places/ChIJ2/photos/AU1' },
      { id: 'last-item', photoResourceName: undefined },
    ]);
    await done();
  });

  it('lists nothing without an upcoming trip', async () => {
    clerkFake.signIn();
    TripsBackendFake();
    const { result, done } = await renderWithLayer(NoFeatures, useMainPlacesListLogic, undefined);

    expect(result.current.derived.listItems).toEqual([]);
    await done();
  });
});

describe('useTripCardLogic', () => {
  it('shows the city, cover and favourite mark of the trip', async () => {
    const { result, done } = await renderWithLayer(images, useTripCardLogic, aTrip({ isFavorite: true }));

    expect(result.current.derived.location).toBe('Lisbon');
    expect(result.current.state).toEqual({
      imageUrl: 'https://images.unsplash.com/lisbon-regular',
      imageBlurHash: 'LKO2?U%2Tw=w',
      isFavorite: true,
    });
    await done();
  });

  it('opens the trip', async () => {
    const { result, done } = await renderWithLayer(images, useTripCardLogic, aTrip());

    result.current.effects.onCardPress();

    expect(routerFake.history).toEqual([
      { verb: 'push', href: { pathname: '/create-trip/trip-details', params: { id: 'trip_lisbon' } } },
    ]);
    await done();
  });
});

describe('useDetailsBoxLogic', () => {
  const useBox = (startDate: string) => useDetailsBoxLogic('trip_lisbon', startDate);

  it('writes the start date the way the language does', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useBox, '2026-11-11');

    expect(result.current.derived.dateLabel).toBe('11/11/2026');
    await done();
  });

  it('opens the trip and the trip list', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useBox, '2026-11-11');

    result.current.effects.handlePress();
    result.current.effects.handleShowAllTripsButton();

    expect(routerFake.history.map(entry => entry.verb)).toEqual(['push', 'navigate']);
    await done();
  });
});

describe('useStartNewTripCardLogic', () => {
  it('opens the wizard for a user with tokens', async () => {
    clerkFake.signIn();
    convexFake.setQuery(api.users.getUserTokens, () => 2);
    const { result, done } = await renderWithLayer(NoFeatures, useStartNewTripCardLogic, undefined);

    result.current.effects.handleStartNewTrip();

    expect(routerFake.history).toEqual([{ verb: 'push', href: '/create-trip/search-place' }]);
    await done();
  });

  it('stays for a user with no tokens left', async () => {
    clerkFake.signIn();
    convexFake.setQuery(api.users.getUserTokens, () => 0);
    const { result, done } = await renderWithLayer(NoFeatures, useStartNewTripCardLogic, undefined);

    result.current.effects.handleStartNewTrip();

    expect(routerFake.history).toEqual([]);
    await done();
  });
});

describe('useFoodCardLogic', () => {
  it('opens the typical dishes of the trip', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useFoodCardLogic, 'trip_lisbon');

    result.current.effects.handleOpenModal();

    expect(routerFake.history).toEqual([
      { verb: 'push', href: { pathname: '/create-trip/typical-dishes-modal', params: { tripId: 'trip_lisbon' } } },
    ]);
    await done();
  });
});

describe('useDishItemLogic', () => {
  it('shows a badge for a dish that fits a diet', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useDishItemLogic, aDish());

    expect(result.current.derived.hasBadge).toBe(true);
    expect(result.current.state).toMatchObject({ name: 'Pastel de nata', vegetarianLabel: 'MY_TRIP.VEGETARIAN' });
    await done();
  });

  it('shows no badge for a dish that fits none', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useDishItemLogic, aDish({ isVegetarian: false }));

    expect(result.current.derived.hasBadge).toBe(false);
    await done();
  });
});

describe('useTripDetailsCardLogic', () => {
  const details = (overrides = {}) => ({
    tripDetails: {
      budget: 'Moderate',
      travelers: 2,
      durationDays: 2,
      durationNights: 1,
      startDate: '11/11/2026',
      endDate: '12/11/2026',
      currency: 'EUR',
      ...overrides,
    },
  });

  it('writes the range of dates and the days and nights', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useTripDetailsCardLogic, details());

    expect(result.current.derived.dateLabel).toBe('11/11/2026 - 12/11/2026');
    expect(result.current.derived.durationLabel).toBe('2 MY_TRIP.DAYS / 1 MY_TRIP.NIGHT');
    await done();
  });

  it('writes one date and only the days for a day trip', async () => {
    const { result, done } = await renderWithLayer(
      NoFeatures,
      useTripDetailsCardLogic,
      details({ endDate: '11/11/2026', durationDays: 1, durationNights: 0 }),
    );

    expect(result.current.derived.dateLabel).toBe('11/11/2026');
    expect(result.current.derived.durationLabel).toBe('1 MY_TRIP.DAYS');
    await done();
  });
});

describe('useTypicalDishesModalHeaderLogic', () => {
  it('counts the dishes', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useTypicalDishesModalHeaderLogic, 2);

    expect(result.current.derived.dishLabel).toBe('MY_TRIP.DISHES');
    await done();
  });
});
