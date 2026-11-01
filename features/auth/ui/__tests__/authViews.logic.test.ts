import { act, renderHook } from '@testing-library/react-native';
import { useWelcomeCardLogic } from '@/features/auth/ui/components/WelcomeCard/WelcomeCard.logic';
import { useWelcomeCardsLogic } from '@/features/auth/ui/components/WelcomeCards/WelcomeCards.logic';
import { useSignInOrUpPageLogic } from '@/features/auth/ui/pages/SignInOrUpPage/SignInOrUpPage.logic';
import { useWelcomePageLogic } from '@/features/auth/ui/pages/WelcomePage/WelcomePage.logic';
import { components } from '@/features/core/design-system';
import { clerkFake, routerFake } from '@/features/core/testing';

describe('useWelcomePageLogic', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('opens sign-in once the cards have flown away', async () => {
    const { result } = await renderHook(useWelcomePageLogic);

    await act(async () => result.current.effects.handlePress());
    expect(routerFake.history).toEqual([]);
    await act(async () => jest.advanceTimersByTime(950));

    expect(routerFake.history).toEqual([{ verb: 'replace', href: '/sign-in-or-sign-up' }]);
  });
});

describe('useWelcomeCardsLogic', () => {
  it('lays out the six welcome cards', async () => {
    const { result } = await renderHook(useWelcomeCardsLogic);

    expect(result.current.state.cards.map(card => card.size)).toEqual([
      'small',
      'medium',
      'large',
      'medium',
      'medium',
      'medium',
    ]);
  });
});

describe('useWelcomeCardLogic', () => {
  const useCard = (size: 'small' | 'medium' | 'large') =>
    useWelcomeCardLogic(size, true, true, 10, 0, 0, undefined, undefined, 1000, false);

  it.each([
    ['small', components.welcomeCardHeightSmall, components.welcomeCardWidthSmall],
    ['medium', components.welcomeCardHeightMedium, components.welcomeCardWidthMedium],
    ['large', components.welcomeCardHeightLarge, components.welcomeCardWidthLarge],
  ] as const)('sizes a %s card', async (size, height, width) => {
    const { result } = await renderHook(useCard, { initialProps: size });

    expect(result.current.derived.cardStyle.container).toMatchObject({ height, width });
  });
});

describe('useSignInOrUpPageLogic', () => {
  it('goes home once the user is signed in', async () => {
    clerkFake.signIn();

    await renderHook(useSignInOrUpPageLogic);

    expect(routerFake.history).toEqual([{ verb: 'replace', href: '/home-page' }]);
  });

  it('stays while the user signs in', async () => {
    await renderHook(useSignInOrUpPageLogic);

    expect(routerFake.history).toEqual([]);
  });
});
