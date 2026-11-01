import { act } from '@testing-library/react-native';
import i18next from 'i18next';
import { api } from '@/convex/_generated/api';
import { clerkFake, convexFake, renderWithLayer, routerFake, StorageFake } from '@/features/core/testing';
import { useChangeLanguagePageLogic } from '@/features/profile/ui/pages/ChangeLanguagePage/ChangeLanguagePage.logic';
import { useProfilePageLogic } from '@/features/profile/ui/pages/ProfilePage/ProfilePage.logic';

const storage = StorageFake();

/** The QA user's Convex records: two trips, one a favourite, and 8 tokens left. */
const aBackend = () => {
  convexFake.setQuery(api.trips.getAllTripsbyUserId, () => [
    { _id: 'trip_lisbon', isFavorite: true },
    { _id: 'trip_kyoto', isFavorite: false },
  ]);
  convexFake.setQuery(api.users.getUserTokens, () => 8);
};

afterEach(async () => {
  await i18next.changeLanguage('en');
});

describe('useProfilePageLogic', () => {
  it("shows the user's name, trips, favourites and tokens", async () => {
    clerkFake.signIn();
    aBackend();
    const { result, done } = await renderWithLayer(storage.layer, useProfilePageLogic, undefined);

    expect(result.current.state).toMatchObject({
      username: 'holidaiqa',
      totalTrips: 2,
      userTokens: 8,
      isTripDataLoading: false,
    });
    expect(result.current.state.favoriteTrips).toHaveLength(1);
    expect(result.current.derived.isUserLoading).toBe(false);
    expect(result.current.derived.profileImage).toMatch(/^https:\/\/img\.clerk\.com\/holidaiqa\.png\?height=/);
    await done();
  });

  it('shows the user as loading while nobody is signed in', async () => {
    aBackend();
    const { result, done } = await renderWithLayer(storage.layer, useProfilePageLogic, undefined);

    expect(result.current.derived.isUserLoading).toBe(true);
    await done();
  });

  it('opens the language, account and trip list screens', async () => {
    clerkFake.signIn();
    aBackend();
    const { result, done } = await renderWithLayer(storage.layer, useProfilePageLogic, undefined);

    result.current.effects.goToChangeLanguage();
    result.current.effects.goToAccountSettings();
    result.current.effects.goToShowAllTrips();

    expect(routerFake.history).toEqual([
      { verb: 'push', href: '/profile/change-language' },
      { verb: 'push', href: '/profile/account-settings' },
      { verb: 'navigate', href: '/trips' },
    ]);
    await done();
  });
});

describe('useChangeLanguagePageLogic', () => {
  it('selects the language the app is in', async () => {
    const { result, done } = await renderWithLayer(storage.layer, useChangeLanguagePageLogic, undefined);

    expect(result.current.state.selectedLanguage).toBe('en');
    await done();
  });

  it('selects, and switches to, the language picked', async () => {
    const { result, done } = await renderWithLayer(storage.layer, useChangeLanguagePageLogic, undefined);

    await act(async () => result.current.effects.changeLanguageHandler('it'));

    expect(result.current.state.selectedLanguage).toBe('it');
    await done();
  });
});
