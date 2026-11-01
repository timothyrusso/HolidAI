import { waitFor } from '@testing-library/react-native';
import { clerkFake, renderWithLayer, routerFake } from '@/features/core/testing';
import { aTrip } from '@/features/trips/__fixtures__/builders';
import { TripImagesFake } from '@/features/trips/di/__tests__/tripImagesFake';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useActivityDetailsPageLogic } from '@/features/trips/ui/pages/ActivityDetailsPage/ActivityDetailsPage.logic';

const images = TripImagesFake();
const photoUrl = (name: string) => `https://places.googleapis.com/v1/${name}/media?key=places-test-key&maxWidthPx=500`;

const renderPage = async (activityId: string) => {
  clerkFake.signIn();
  TripsBackendFake([aTrip()]);
  routerFake.setParams({ tripId: 'trip_lisbon', activityId });
  return renderWithLayer(images, useActivityDetailsPageLogic, undefined);
};

describe('useActivityDetailsPageLogic', () => {
  it('shows the activity asked for', async () => {
    const { result, done } = await renderPage('2');

    expect(result.current.state).toMatchObject({ locationTitle: 'Belém Tower', ticketPricing: 0, currency: 'EUR' });
    await done();
  });

  it('shows the first photo large and the others in the carousel', async () => {
    const { result, done } = await renderPage('1');

    await waitFor(() => expect(result.current.derived.imageData).toBe(photoUrl('places/ChIJ1/photos/AU1')));
    expect(result.current.derived.carouselImages).toEqual([{ url: photoUrl('places/ChIJ1/photos/AU2') }]);
    await done();
  });

  it('shows nothing for an activity the trip does not have', async () => {
    const { result, done } = await renderPage('99');

    expect(result.current.state.locationTitle).toBeUndefined();
    expect(result.current.derived).toEqual({ imageData: undefined, carouselImages: [] });
    await done();
  });

  it('goes back', async () => {
    const { result, done } = await renderPage('1');

    result.current.effects.goBackHandler();

    expect(routerFake.history).toEqual([{ verb: 'back', href: null }]);
    await done();
  });
});
