import { clerkFake, NoFeatures, renderWithLayer } from '@/features/core/testing';
import { aTrip } from '@/features/trips/__fixtures__/builders';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useTripListPageLogic } from '@/features/trips/ui/pages/TripListPage/TripListPage.logic';

describe('useTripListPageLogic', () => {
  it("lists the user's trips", async () => {
    clerkFake.signIn();
    TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(NoFeatures, useTripListPageLogic, undefined);

    expect(result.current.derived.userTrips).toEqual([aTrip()]);
    await done();
  });

  it('lists four skeleton cards while the trips load', async () => {
    TripsBackendFake([aTrip()]);
    const { result, done } = await renderWithLayer(NoFeatures, useTripListPageLogic, undefined);

    expect(result.current.derived.userTrips).toHaveLength(4);
    expect(result.current.derived.userTrips?.every(item => 'uuid' in item)).toBe(true);
    await done();
  });
});
