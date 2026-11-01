import { routerFake } from '@/features/core/testing/routerFake';

// NOTE: runs in every test file once jest's globals exist. The router fake is module state shared
// by the tests of a file, so each test starts on a clean history and no params.
beforeEach(() => {
  routerFake.reset();
});
