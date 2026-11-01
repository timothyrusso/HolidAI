import { clerkFake, renderWithLayer, routerFake } from '@/features/core/testing';
import { aTrip } from '@/features/trips/__fixtures__/builders';
import { TripImagesFake } from '@/features/trips/di/__tests__/tripImagesFake';
import { TripsBackendFake } from '@/features/trips/di/__tests__/tripsBackendFake';
import { useDishDetailsModalPageLogic } from '@/features/trips/ui/pages/DishDetailsModalPage/DishDetailsModalPage.logic';

const renderModal = async (searchTerm: string) => {
  clerkFake.signIn();
  TripsBackendFake([aTrip()]);
  routerFake.setParams({ tripId: 'trip_lisbon', searchTerm });
  return renderWithLayer(TripImagesFake(), useDishDetailsModalPageLogic, undefined);
};

describe('useDishDetailsModalPageLogic', () => {
  it('shows the dish asked for, with its diet badges', async () => {
    const { result, done } = await renderModal('pastel de nata');

    expect(result.current.state).toMatchObject({
      dishName: 'Pastel de nata',
      dishIngredients: ['eggs', 'cream', 'puff pastry'],
      image: 'https://upload.wikimedia.org/pastel-de-nata.jpg',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
    });
    await done();
  });

  it('shows an empty dish the trip does not have', async () => {
    const { result, done } = await renderModal('francesinha');

    expect(result.current.state).toMatchObject({ dishName: '', dishDescription: '', dishIngredients: [] });
    await done();
  });

  it('closes', async () => {
    const { result, done } = await renderModal('pastel de nata');

    result.current.effects.handleClose();

    expect(routerFake.history).toEqual([{ verb: 'back', href: null }]);
    await done();
  });
});
