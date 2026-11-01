import { api } from '@/convex/_generated/api';
import { clerkFake, convexFake, renderWithLayer, routerFake } from '@/features/core/testing';
import { aTrip, aTripAiResp } from '@/features/trips/__fixtures__/builders';
import { TripImagesFake } from '@/features/trips/di/__tests__/tripImagesFake';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useUpcomingTripPageLogic } from '@/features/trips/ui/pages/UpcomingTripPage/UpcomingTripPage.logic';

const images = TripImagesFake();
const NEXT_YEAR = aTrip({
  tripAiResp: { ...aTripAiResp(), tripDetails: { ...aTripAiResp().tripDetails, startDate: '2099-11-11' } },
});

const renderPage = async (tokens: number) => {
  clerkFake.signIn();
  TripsBackendFake([NEXT_YEAR]);
  convexFake.setQuery(api.users.getUserTokens, () => tokens);
  return renderWithLayer(images, useUpcomingTripPageLogic, undefined);
};

describe('useUpcomingTripPageLogic', () => {
  it('shows the next trip, its city and cover, and how many trips there are', async () => {
    const { result, done } = await renderPage(5);

    expect(result.current.state).toMatchObject({
      tripId: 'trip_lisbon',
      tripStartDate: '2099-11-11',
      image: 'https://images.unsplash.com/lisbon-regular',
      totalTrips: 1,
      isLoading: false,
    });
    expect(result.current.derived.location).toBe('Lisbon');
    await done();
  });

  it('opens the wizard for a user with tokens', async () => {
    const { result, done } = await renderPage(5);

    result.current.effects.startNewTrip();

    expect(routerFake.history).toEqual([{ verb: 'push', href: '/create-trip/search-place' }]);
    await done();
  });

  it('stays for a user with no tokens left', async () => {
    const { result, done } = await renderPage(0);

    result.current.effects.startNewTrip();

    expect(routerFake.history).toEqual([]);
    await done();
  });
});
