import { act, waitFor } from '@testing-library/react-native';
import { api } from '@/convex/_generated/api';
import { clerkFake, convexFake, NoFeatures, renderWithLayer } from '@/features/core/testing';
import { aTrip, aTripId } from '@/features/trips/__fixtures__/builders';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useDeleteTrip } from '@/features/trips/facades/useDeleteTrip';
import { useToggleFavoriteTrip } from '@/features/trips/facades/useToggleFavoriteTrip';

describe('useDeleteTrip', () => {
  it('deletes the trip', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip(), aTrip({ _id: aTripId('trip_porto') })]);
    const { result, done } = await renderWithLayer(NoFeatures, useDeleteTrip, undefined);

    await act(async () => result.current.deleteTrip(aTripId()));

    await waitFor(() => expect(backend.trips().map(trip => trip._id)).toEqual(['trip_porto']));
    await done();
  });

  it('keeps the trip, and logs an UnexpectedError, when Convex rejects the delete', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    convexFake.failMutation(api.trips.deleteTrip);
    const { result, logs, done } = await renderWithLayer(NoFeatures, useDeleteTrip, undefined);

    await act(async () => result.current.deleteTrip(aTripId()));

    await waitFor(() => expect(logs.entries.map(entry => entry.message)).toEqual(['UnexpectedError']));
    expect(backend.trips()).toEqual([aTrip()]);
    await done();
  });
});

describe('useToggleFavoriteTrip', () => {
  it('marks the trip as a favourite', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(NoFeatures, useToggleFavoriteTrip, undefined);

    await act(async () => result.current.toggleFavoriteTrip({ id: aTripId(), isFavorite: true }));

    await waitFor(() => expect(backend.trips()[0]?.isFavorite).toBe(true));
    await done();
  });

  it('leaves the trip as it was, and logs an UnexpectedError, when Convex rejects the change', async () => {
    clerkFake.signIn();
    const backend = TripsBackendFake([aTrip()]);
    convexFake.failMutation(api.trips.toggleFavoriteTrip);
    const { result, logs, done } = await renderWithLayer(NoFeatures, useToggleFavoriteTrip, undefined);

    await act(async () => result.current.toggleFavoriteTrip({ id: aTripId(), isFavorite: true }));

    await waitFor(() => expect(logs.entries.map(entry => entry.message)).toEqual(['UnexpectedError']));
    expect(backend.trips()[0]?.isFavorite).toBe(false);
    await done();
  });
});
