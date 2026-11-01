import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { clerkFake } from '@/features/core/testing/clerkFake';
import { convexFake } from '@/features/core/testing/convexFake';
import { routerFake } from '@/features/core/testing/routerFake';

// NOTE: runs in every test file once jest's globals exist. The router, Convex and Clerk fakes are
// module state shared by the tests of a file, so each test starts on a clean history, no backend
// and nobody signed in.
beforeEach(() => {
  routerFake.reset();
  convexFake.reset();
  clerkFake.reset();
});

// NOTE: i18n with no catalog, in English: `t` returns the key, so a test asserts the key a
// ViewModel picked, not copy that changes with the catalog.
beforeAll(async () => {
  if (!i18next.isInitialized) {
    await i18next.use(initReactI18next).init({ lng: 'en', showSupportNotice: false, resources: {} });
  }
});
