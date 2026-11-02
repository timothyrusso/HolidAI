import { clerkFake, NoFeatures, renderWithLayer } from '@/features/core/testing';
import { aTrip, aTripAiResp, aTripId } from '@/features/trips/__fixtures__/builders';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useGetFavoriteTrips } from '@/features/trips/facades/useGetFavoriteTrips';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useGetTrips } from '@/features/trips/facades/useGetTrips';
import { useGetUpcomingTrip } from '@/features/trips/facades/useGetUpcomingTrip';

const aTripStarting = (id: string, startDate: string) =>
  aTrip({
    _id: aTripId(id),
    tripAiResp: { ...aTripAiResp(), tripDetails: { ...aTripAiResp().tripDetails, startDate } },
  });

const PAST = aTripStarting('trip_past', '2020-03-01');
const LATER = aTripStarting('trip_later', '2099-06-01');
const SOONER = aTripStarting('trip_sooner', '2099-01-15');

describe('useGetTrips', () => {
  it("returns the signed-in user's trips and how many there are", async () => {
    clerkFake.signIn();
    TripsBackendFake([aTrip(), PAST]);
    const { result, done } = await renderWithLayer(NoFeatures, useGetTrips, undefined);

    expect(result.current.trips).toEqual([aTrip(), PAST]);
    expect(result.current.totalTrips).toBe(2);
    expect(result.current.isLoading).toBe(false);
    await done();
  });

  it('is loading, with no trips, while nobody is signed in', async () => {
    TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(NoFeatures, useGetTrips, undefined);

    expect(result.current).toEqual({ trips: undefined, isLoading: true, totalTrips: 0 });
    await done();
  });
});

describe('useGetTripById', () => {
  it('returns the trip with the id', async () => {
    clerkFake.signIn();
    TripsBackendFake([aTrip(), PAST]);
    const { result, done } = await renderWithLayer(NoFeatures, useGetTripById, 'trip_past');

    expect(result.current.trip).toEqual(PAST);
    await done();
  });

  it('returns no trip for an unknown id', async () => {
    clerkFake.signIn();
    TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(NoFeatures, useGetTripById, 'trip_unknown');

    expect(result.current.trip).toBeUndefined();
    await done();
  });
});

describe('useGetFavoriteTrips', () => {
  it('returns only the favourite trips', async () => {
    clerkFake.signIn();
    const favourite = aTrip({ _id: aTripId('trip_favourite'), isFavorite: true });
    TripsBackendFake([aTrip(), favourite]);
    const { result, done } = await renderWithLayer(NoFeatures, useGetFavoriteTrips, undefined);

    expect(result.current.favoriteTrips).toEqual([favourite]);
    await done();
  });
});

describe('useGetUpcomingTrip', () => {
  it('returns the trip starting soonest from today, skipping past ones', async () => {
    clerkFake.signIn();
    TripsBackendFake([PAST, LATER, SOONER]);
    const { result, done } = await renderWithLayer(NoFeatures, useGetUpcomingTrip, undefined);

    expect(result.current.upcomingTrip).toEqual(SOONER);
    await done();
  });

  it('returns no trip when every trip is over', async () => {
    clerkFake.signIn();
    TripsBackendFake([PAST]);
    const { result, done } = await renderWithLayer(NoFeatures, useGetUpcomingTrip, undefined);

    expect(result.current).toEqual({ upcomingTrip: undefined, isLoading: false });
    await done();
  });
});
