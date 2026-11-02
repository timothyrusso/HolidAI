import { routerFake } from '@/features/core/testing/routerFake';

/**
 * expo-router as a ViewModel test sees it: the real module (its components load under Node) with
 * the hooks and the imperative router that need a mounted navigator replaced by `routerFake`.
 */
const actual = jest.requireActual('expo-router');

module.exports = {
  ...actual,
  router: routerFake.router,
  useRouter: () => routerFake.router,
  useLocalSearchParams: () => routerFake.params,
  useGlobalSearchParams: () => routerFake.params,
  usePathname: () => routerFake.pathname,
  useNavigation: () => routerFake.navigation,
  useIsFocused: () => routerFake.navigation.isFocused(),
};
