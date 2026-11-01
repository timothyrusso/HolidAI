import { act, waitFor } from '@testing-library/react-native';
import { clerkFake, NoFeatures, renderWithLayer, routerFake } from '@/features/core/testing';
import { aTrip } from '@/features/trips/__fixtures__/builders';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useHeaderIconsLogic } from '@/features/trips/ui/components/HeaderIcons/HeaderIcons.logic';

const renderIcons = async (params: Record<string, string> = { id: 'trip_lisbon' }) => {
  clerkFake.signIn();
  const backend = TripsBackendFake([aTrip()]);
  routerFake.setParams(params);
  return { backend, ...(await renderWithLayer(NoFeatures, useHeaderIconsLogic, undefined)) };
};

describe('useHeaderIconsLogic', () => {
  it('marks the trip as a favourite, with the animation', async () => {
    const { result, backend, done } = await renderIcons();

    await act(async () => result.current.effects.addToFavoritesHandler());

    await waitFor(() => expect(result.current.state.isFavorite).toBe(true));
    expect(result.current.state.shouldAnimate).toBe(true);
    expect(backend.trips()[0]?.isFavorite).toBe(true);
    await done();
  });

  it('deletes the trip and goes back', async () => {
    const { result, backend, done } = await renderIcons();

    await act(async () => result.current.effects.handleDeleteTrip());

    await waitFor(() => expect(routerFake.history).toEqual([{ verb: 'back', href: null }]));
    expect(backend.trips()).toEqual([]);
    await done();
  });

  it('goes back from a trip opened from the list', async () => {
    const { result, done } = await renderIcons();

    result.current.effects.goBackHandler();

    expect(routerFake.history).toEqual([{ verb: 'back', href: null }]);
    await done();
  });

  it('goes home from a trip just generated', async () => {
    const { result, done } = await renderIcons({ id: 'trip_lisbon', fromGenerate: 'true' });

    result.current.effects.goBackHandler();

    expect(routerFake.history).toEqual([{ verb: 'replace', href: '/home-page' }]);
    await done();
  });

  it('does not favourite a trip that is not loaded', async () => {
    const { result, backend, done } = await renderIcons({ id: 'trip_unknown' });

    await act(async () => result.current.effects.addToFavoritesHandler());

    expect(backend.trips()).toEqual([aTrip()]);
    expect(result.current.state.shouldAnimate).toBe(false);
    await done();
  });

  it('does not delete a trip that is not loaded, and stays', async () => {
    const { result, backend, done } = await renderIcons({ id: 'trip_unknown' });

    await act(async () => result.current.effects.handleDeleteTrip());

    expect(backend.trips()).toEqual([aTrip()]);
    expect(routerFake.history).toEqual([]);
    await done();
  });
});
