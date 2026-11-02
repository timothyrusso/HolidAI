const preset = require('@timothyrusso/config-presets/jest');

/**
 * The kit's Jest preset plus HolidAI's deltas:
 *
 * - `__mocks__/@sentry/react-native.ts` keeps the Sentry SDK from leaving a timer behind, and
 *   `jestAfterEnv.ts` resets the router, Convex and Clerk fakes the root `__mocks__/` hand out.
 * - Coverage is measured over `features/`, as Kinetiq does: the Convex functions run on Convex's
 *   servers and the Storybook config on Storybook's, not in the app.
 */
const config = {
  ...preset,
  setupFilesAfterEnv: ['<rootDir>/features/core/testing/jestAfterEnv.ts'],
  collectCoverageFrom: [
    '<rootDir>/features/**/*.ts',
    ...preset.collectCoverageFrom.filter(pattern => pattern.startsWith('!')),
  ],
};

module.exports = config;
