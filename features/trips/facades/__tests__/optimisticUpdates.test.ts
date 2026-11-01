import { act, waitFor } from '@testing-library/react-native';
import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { clerkFake, convexFake, NoFeatures, renderWithLayer } from '@/features/core/testing';
import { aTrip, aTripId } from '@/features/trips/__fixtures__/builders';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useToggleFavoriteTrip } from '@/features/trips/facades/useToggleFavoriteTrip';

/** The trip on screen next to the image writes the retry facades send. */
const useTripAndWrites = () => {
  const { trip } = useGetTripById('trip_lisbon');
  const repo = useTripRepository();
  const cover = useEffectMutation({ mutationFn: repo.updateCoverImage });
  const dish = useEffectMutation({ mutationFn: repo.updateDishImage });
  const photos = useEffectMutation({ mutationFn: repo.updateActivityPhotos });
  return { trip, updateCover: cover.mutate, updateDish: dish.mutate, updatePhotos: photos.mutate };
};

const useTripAndFavourite = () => ({ ...useGetTripById('trip_lisbon'), ...useToggleFavoriteTrip() });

beforeEach(() => {
  clerkFake.signIn();
  convexFake.hold();
});

afterEach(() => {
  convexFake.release();
});

describe('the trips repository, before Convex confirms a change', () => {
  it('shows the trip as a favourite at once', async () => {
    const backend = TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(NoFeatures, useTripAndFavourite, undefined);

    await act(async () => result.current.toggleFavoriteTrip({ id: aTripId(), isFavorite: true }));

    await waitFor(() => expect(result.current.trip?.isFavorite).toBe(true));
    expect(backend.trips()[0]?.isFavorite).toBe(false);
    await done();
  });

  it('shows the new cover at once', async () => {
    TripsBackendFake([aTrip()]);
    const coverImage = { url: 'https://images.unsplash.com/lisbon-new', blurHash: 'LEHV6nWB2yk8' };
    const { result, done } = await renderWithLayer(NoFeatures, useTripAndWrites, undefined);

    await act(async () => result.current.updateCover({ id: aTripId(), coverImage }));

    await waitFor(() => expect(result.current.trip?.tripAiResp.coverImage).toEqual(coverImage));
    await done();
  });

  it('shows the new dish picture at once, on that dish only', async () => {
    TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(NoFeatures, useTripAndWrites, undefined);

    await act(async () =>
      result.current.updateDish({
        id: aTripId(),
        searchTerm: 'pastel de nata',
        imageUrl: 'https://upload.wikimedia.org/new.jpg',
      }),
    );

    await waitFor(() =>
      expect(result.current.trip?.tripAiResp.food.typicalDishes.map(dish => dish.imageUrl)).toEqual([
        'https://upload.wikimedia.org/new.jpg',
        'https://upload.wikimedia.org/pastel-de-nata.jpg',
      ]),
    );
    await done();
  });

  it('shows the new activity photos at once, on that activity only', async () => {
    TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(NoFeatures, useTripAndWrites, undefined);

    await act(async () =>
      result.current.updatePhotos({ id: aTripId(), placeNumberID: 2, photoResourceNames: ['places/ChIJ2/photos/NEW'] }),
    );

    await waitFor(() =>
      expect(result.current.trip?.tripAiResp.dayPlans[0]?.schedule.map(item => item.photoResourceNames)).toEqual([
        ['places/ChIJ1/photos/AU1', 'places/ChIJ1/photos/AU2'],
        ['places/ChIJ2/photos/NEW'],
      ]),
    );
    await done();
  });

  it('leaves another trip as it was', async () => {
    const other = aTrip({ _id: aTripId('trip_porto') });
    TripsBackendFake([aTrip(), other]);
    const useOther = () => ({ ...useGetTripById('trip_porto'), ...useToggleFavoriteTrip() });
    const { result, done } = await renderWithLayer(NoFeatures, useOther, undefined);

    await act(async () => result.current.toggleFavoriteTrip({ id: aTripId(), isFavorite: true }));

    expect(result.current.trip).toEqual(other);
    await done();
  });
});
