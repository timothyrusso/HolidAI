import { clerkFake, NoFeatures, renderWithLayer, routerFake } from '@/features/core/testing';
import { anActivity, aTrip, aTripAiResp } from '@/features/trips/__fixtures__/builders';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useTripDetailsPageLogic } from '@/features/trips/ui/pages/TripDetailsPage/TripDetailsPage.logic';

const renderPage = async (trips = [aTrip()]) => {
  clerkFake.signIn();
  TripsBackendFake(trips);
  routerFake.setParams({ id: 'trip_lisbon' });
  return renderWithLayer(NoFeatures, useTripDetailsPageLogic, undefined);
};

describe('useTripDetailsPageLogic', () => {
  it('names the destination by its city', async () => {
    const { result, done } = await renderPage();

    expect(result.current.derived.location).toBe('Lisbon');
    await done();
  });

  it('shows the dates, length, travelers and budget of the trip', async () => {
    const { result, done } = await renderPage();

    expect(result.current.derived.tripDetails).toEqual({
      budget: 'Moderate',
      travelers: 2,
      durationDays: 2,
      durationNights: 1,
      startDate: '11/11/2026',
      endDate: '11/12/2026',
      currency: 'EUR',
    });
    await done();
  });

  it('lists one section per day', async () => {
    const { result, done } = await renderPage();

    expect(result.current.derived.sectionData?.map(section => section.title)).toEqual(['Day 1']);
    await done();
  });

  it('pins every activity on the map, centred on all of them', async () => {
    const { result, done } = await renderPage();

    expect(result.current.derived.allCoordinates?.map(pin => pin.title)).toEqual([
      'Jerónimos Monastery',
      'Belém Tower',
    ]);
    expect(result.current.derived.region.latitude).toBeCloseTo((38.6979 + 38.6916) / 2);
    expect(result.current.derived.region.longitudeDelta).toBeCloseTo((9.216 - 9.2063) * 1.5);
    await done();
  });

  it('keeps a minimum zoom for activities at one spot', async () => {
    const oneSpot = aTrip({
      tripAiResp: aTripAiResp({ dayPlans: [{ day: 1, theme: 'Belém', schedule: [anActivity()] }] }),
    });
    const { result, done } = await renderPage([oneSpot]);

    expect(result.current.derived.region).toMatchObject({ latitudeDelta: 0.01, longitudeDelta: 0.01 });
    await done();
  });

  it('shows the cover and its blur hash', async () => {
    const { result, done } = await renderPage();

    expect(result.current.state).toMatchObject({
      imageUrl: 'https://images.unsplash.com/lisbon-regular',
      imageBlurHash: 'LKO2?U%2Tw=w',
      currency: 'EUR',
    });
    await done();
  });

  it('shows an empty page centred on a default region while the trip loads', async () => {
    const { result, done } = await renderPage([]);

    expect(result.current.derived.location).toBe('');
    expect(result.current.derived.region).toMatchObject({ latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
    expect(result.current.derived.tripDetails).toMatchObject({ startDate: '', travelers: 0, currency: 'N/A' });
    await done();
  });
});
