import type { Href } from 'expo-router';

/** One navigation the code asked for, as the test reads it: the verb and the target. */
interface Navigation {
  readonly verb: 'push' | 'replace' | 'navigate' | 'back' | 'dismiss' | 'dismissTo' | 'dispatch';
  readonly href: Href | null;
}

const history: Navigation[] = [];
const state = { params: {} as Record<string, string>, pathname: '/', canGoBack: true };

const record = (verb: Navigation['verb'], href: Href | null = null) => void history.push({ verb, href });

/**
 * The router a ViewModel test runs against, in place of expo-router's, which needs a mounted
 * navigator. `__mocks__/expo-router.ts` hands it out from `router`, `useRouter`,
 * `useLocalSearchParams`, `usePathname`, `useNavigation` and `useIsFocused` (always focused). A
 * test sets the route's params with `setParams` and reads where the code went from `history`;
 * `reset` runs before every test.
 */
export const routerFake = {
  history: history as readonly Navigation[],
  get params(): Record<string, string> {
    return state.params;
  },
  get pathname(): string {
    return state.pathname;
  },
  setParams: (params: Record<string, string>) => {
    state.params = params;
  },
  setPathname: (pathname: string) => {
    state.pathname = pathname;
  },
  setCanGoBack: (canGoBack: boolean) => {
    state.canGoBack = canGoBack;
  },
  reset: () => {
    history.length = 0;
    state.params = {};
    state.pathname = '/';
    state.canGoBack = true;
  },
  router: {
    push: (href: Href) => record('push', href),
    replace: (href: Href) => record('replace', href),
    navigate: (href: Href) => record('navigate', href),
    back: () => record('back'),
    dismiss: () => record('dismiss'),
    dismissTo: (href: Href) => record('dismissTo', href),
    dismissAll: () => record('dismiss'),
    canGoBack: () => state.canGoBack,
    canDismiss: () => state.canGoBack,
    setParams: (params: Record<string, string>) => {
      state.params = { ...state.params, ...params };
    },
  },
  navigation: {
    dispatch: () => record('dispatch'),
    setOptions: () => undefined,
    addListener: () => () => undefined,
    isFocused: () => true,
    canGoBack: () => state.canGoBack,
    goBack: () => record('back'),
  },
};
