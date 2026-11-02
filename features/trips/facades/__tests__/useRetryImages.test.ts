import { act, waitFor } from '@testing-library/react-native';
import { clerkFake, renderWithLayer } from '@/features/core/testing';
import { aTrip, aTripId } from '@/features/trips/__fixtures__/builders';
import {
  LISBON_COVER,
  MONASTERY_PHOTOS,
  NATA_PICTURE,
  TripImagesFake,
} from '@/features/trips/di/__tests__/tripImagesFake';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useRetryActivityImage } from '@/features/trips/facades/useRetryActivityImage';
import { useRetryCoverImage } from '@/features/trips/facades/useRetryCoverImage';
import { useRetryDishImage } from '@/features/trips/facades/useRetryDishImage';

const online = TripImagesFake('online');
const offline = TripImagesFake('offline');

const FAILED_URL = 'https://images.unsplash.com/lisbon-regular';

const coverOf = (backend: ReturnType<typeof TripsBackendFake>) => backend.trips()[0]?.tripAiResp.coverImage;

const useCoverRetry = ({ id, location }: { id: ReturnType<typeof aTripId> | undefined; location: string }) =>
  useRetryCoverImage(id, location);

describe('useRetryCoverImage', () => {
  it('saves the new cover the search found', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(online, useCoverRetry, { id: aTripId(), location: 'Lisbon' });

    await act(async () => result.current.retryCoverImage(FAILED_URL));

    await waitFor(() => expect(coverOf(backend)).toEqual(LISBON_COVER));
    await done();
  });

  it('keeps the cover offline', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(offline, useCoverRetry, { id: aTripId(), location: 'Lisbon' });

    await act(async () => result.current.retryCoverImage(FAILED_URL));

    expect(coverOf(backend)).toEqual(aTrip().tripAiResp.coverImage);
    await done();
  });

  it('keeps the cover, and logs the failure, when the provider fails', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    const { result, logs, done } = await renderWithLayer(online, useCoverRetry, { id: aTripId(), location: 'Porto' });

    await act(async () => result.current.retryCoverImage(FAILED_URL));

    await waitFor(() => expect(logs.entries.map(entry => entry.message)).toEqual(['ImageFetchFailed']));
    expect(coverOf(backend)).toEqual(aTrip().tripAiResp.coverImage);
    await done();
  });

  it('retries a failed URL only once', async () => {
    clerkFake.signIn();
    TripsBackendFake([aTrip()]);
    const { result, logs, done } = await renderWithLayer(online, useCoverRetry, { id: aTripId(), location: 'Porto' });

    await act(async () => result.current.retryCoverImage(FAILED_URL));
    await waitFor(() => expect(logs.entries).toHaveLength(1));
    await act(async () => result.current.retryCoverImage(FAILED_URL));

    expect(logs.entries).toHaveLength(1);
    await done();
  });

  it('does nothing before the trip is known', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(online, useCoverRetry, { id: undefined, location: 'Lisbon' });

    await act(async () => result.current.retryCoverImage(FAILED_URL));

    expect(coverOf(backend)).toEqual(aTrip().tripAiResp.coverImage);
    await done();
  });
});

const useDishRetry = (searchTerm: string) => useRetryDishImage(aTripId(), searchTerm);

describe('useRetryDishImage', () => {
  it('saves the new picture of the dish', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(online, useDishRetry, 'pastel de nata');

    await act(async () => result.current.retryDishImage('https://upload.wikimedia.org/pastel-de-nata.jpg'));

    await waitFor(() => expect(backend.trips()[0]?.tripAiResp.food.typicalDishes[0]?.imageUrl).toBe(NATA_PICTURE));
    await done();
  });
});

const useActivityRetry = (placeName: string) => useRetryActivityImage(aTripId(), 1, placeName, 'Lisbon');

describe('useRetryActivityImage', () => {
  it('saves the names of the new photos of the activity', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(online, useActivityRetry, 'Jerónimos Monastery');

    await act(async () => result.current.retryActivityImage('https://places.googleapis.com/v1/places/ChIJ1'));

    await waitFor(() =>
      expect(backend.trips()[0]?.tripAiResp.dayPlans[0]?.schedule[0]?.photoResourceNames).toEqual(MONASTERY_PHOTOS),
    );
    await done();
  });
});
