import { act, waitFor } from '@testing-library/react-native';
import { api } from '@/convex/_generated/api';
import { A_CLERK_USER, clerkFake, convexFake, renderWithLayer } from '@/features/core/testing';
import { aGeneratedTrip } from '@/features/trip-generation/__fixtures__/builders';
import { KYOTO_COVER, KyotoImagesFake } from '@/features/trip-generation/di/__tests__/tripImagesFake';
import { useSaveTrip } from '@/features/trip-generation/facades/useSaveTrip';

const images = KyotoImagesFake();

/** Convex's `createTrip`, keeping what it was sent. */
const createTrips = () => {
  const created: { userId: string; isFavorite: boolean; tripAiResp: { coverImage: unknown } }[] = [];
  convexFake.setMutation(api.trips.createTrip, args => {
    created.push(args);
    return 'trip_kyoto';
  });
  return created;
};

describe('useSaveTrip', () => {
  it('saves the trip with its pictures for the signed-in user, not as a favourite', async () => {
    clerkFake.signIn();
    const created = createTrips();
    const { result, done } = await renderWithLayer(images, useSaveTrip, undefined);

    await act(async () => result.current.save(aGeneratedTrip()));

    await waitFor(() => expect(created).toHaveLength(1));
    expect(created[0]).toMatchObject({ userId: A_CLERK_USER.id, isFavorite: false });
    expect(created[0]?.tripAiResp.coverImage).toEqual(KYOTO_COVER);
    await done();
  });

  it('hands the new trip id to the caller', async () => {
    clerkFake.signIn();
    createTrips();
    const ids: string[] = [];
    const { result, done } = await renderWithLayer(images, useSaveTrip, undefined);

    await act(async () => result.current.save(aGeneratedTrip(), { onSuccess: id => void ids.push(id) }));

    await waitFor(() => expect(ids).toEqual(['trip_kyoto']));
    await done();
  });

  it('reports an UnexpectedError, and saves nothing, when Convex rejects the trip', async () => {
    clerkFake.signIn();
    const created = createTrips();
    convexFake.failMutation(api.trips.createTrip);
    const { result, done } = await renderWithLayer(images, useSaveTrip, undefined);

    await act(async () => result.current.save(aGeneratedTrip()));

    await waitFor(() => expect(result.current.error?._tag).toBe('UnexpectedError'));
    expect(created).toEqual([]);
    await done();
  });
});
