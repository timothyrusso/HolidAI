import { clerkFake, NoFeatures, renderWithLayer, routerFake } from '@/features/core/testing';
import { aTrip } from '@/features/trips/__fixtures__/builders';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useTypicalDishesModalPageLogic } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.logic';

const renderModal = async () => {
  clerkFake.signIn();
  TripsBackendFake([aTrip()]);
  routerFake.setParams({ tripId: 'trip_lisbon' });
  return renderWithLayer(NoFeatures, useTypicalDishesModalPageLogic, undefined);
};

describe('useTypicalDishesModalPageLogic', () => {
  it('lists the dishes of the destination', async () => {
    const { result, done } = await renderModal();

    expect(result.current.derived).toEqual({ location: 'Lisbon', dishNumber: 2 });
    expect(result.current.state.dishItems?.map(dish => dish.name)).toEqual(['Pastel de nata', 'Bacalhau à Brás']);
    await done();
  });

  it('opens a dish', async () => {
    const { result, done } = await renderModal();

    result.current.effects.handleDishPress('pastel de nata');

    expect(routerFake.history).toEqual([
      {
        verb: 'push',
        href: {
          pathname: '/create-trip/dish-details-modal',
          params: { tripId: 'trip_lisbon', searchTerm: 'pastel de nata' },
        },
      },
    ]);
    await done();
  });

  it('closes', async () => {
    const { result, done } = await renderModal();

    result.current.effects.handleClose();

    expect(routerFake.history).toEqual([{ verb: 'back', href: null }]);
    await done();
  });
});
