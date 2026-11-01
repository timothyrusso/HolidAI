const preset = require('@timothyrusso/config-presets/jest');

/** Packages that ship ES modules on top of the ones the kit preset already transforms. */
const ESM_PACKAGES = ['inversify', '@inversifyjs'];

/** The core concerns already on Effect (#503). */
const EFFECT_FOOTPRINT = '{config,error,http,images,logger,network,performance,runtime,sentry,storage}';

/** The Inversify classes and deprecated shims still inside those concerns, deleted by #504 and #505. */
const LEGACY_UNTIL_505 = [
  'error/data/services/{BasicLogger,SentryLogger}.ts',
  'error/domain/entities/**',
  'error/domain/utils/ensureError.ts',
  'error/mappers/errorCodeToMessageKey.ts',
  'http/data/services/HttpClient.ts',
  'images/data/repositories/{GooglePlaces,Unsplash,WikimediaDish}ImageRepository.ts',
  'images/useCases/*UseCase.ts',
  'network/data/services/NetworkService.ts',
  'network/useCases/CheckConnectivityUseCase.ts',
  'performance/data/services/{Noop,Sentry}PerformanceTracker.ts',
  'sentry/data/services/SentryClient.ts',
  'storage/data/services/LocalStorage.ts',
];

/**
 * ViewModels inside those concerns that are not on Effect yet: the crash views log through the
 * deprecated `logger` and navigate through the Inversify `navigationService`. #505 moves and tests them.
 */
const VIEWMODELS_UNTIL_505 = ['error/ui/**'];

/**
 * The kit's Jest preset plus HolidAI's deltas:
 *
 * - `inversify` ships ES modules, and the core public APIs still load the container through the
 *   deprecated shims until #505 removes it. `__mocks__/@sentry/react-native.ts` keeps the Sentry
 *   SDK, which those APIs also load, from leaving a timer behind.
 * - `jestAfterEnv.ts` resets the router fake that `__mocks__/expo-router.ts` hands out.
 * - Coverage is measured over the Effect footprint, without its legacy files and ViewModels: the features still
 *   on Inversify have no tests until they move (#504, #505), and #505 measures the whole tree.
 */
const config = {
  ...preset,
  transformIgnorePatterns: preset.transformIgnorePatterns.map(pattern =>
    pattern.replace(/(\/?node_modules\/\(\?!\()/, `$1${ESM_PACKAGES.join('|')}|`),
  ),
  setupFilesAfterEnv: ['<rootDir>/features/core/testing/jestAfterEnv.ts'],
  collectCoverageFrom: [
    `<rootDir>/features/core/${EFFECT_FOOTPRINT}/**/*.ts`,
    ...preset.collectCoverageFrom.slice(1),
    ...[...LEGACY_UNTIL_505, ...VIEWMODELS_UNTIL_505].map(path => `!<rootDir>/features/core/${path}`),
  ],
};

module.exports = config;
