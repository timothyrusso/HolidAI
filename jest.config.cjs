const preset = require('@timothyrusso/config-presets/jest');

/** Packages that ship ES modules on top of the ones the kit preset already transforms. */
const ESM_PACKAGES = ['inversify', '@inversifyjs'];

/** The core concerns (#503) and the features (#504) already on Effect, under `features/`. */
const EFFECT_FOOTPRINT =
  '{core/{config,error,http,images,logger,network,performance,runtime,sentry,storage},ai,trip-generation}';

/** The Inversify classes, deprecated shims and untouched stores still inside those, deleted or moved by #505. */
const LEGACY_UNTIL_505 = [
  'core/error/data/services/{BasicLogger,SentryLogger}.ts',
  'core/error/domain/entities/**',
  'core/error/domain/utils/ensureError.ts',
  'core/error/mappers/errorCodeToMessageKey.ts',
  'core/http/data/services/HttpClient.ts',
  'core/images/data/repositories/{GooglePlaces,Unsplash,WikimediaDish}ImageRepository.ts',
  'core/images/useCases/*UseCase.ts',
  'core/network/data/services/NetworkService.ts',
  'core/network/useCases/CheckConnectivityUseCase.ts',
  'core/performance/data/services/{Noop,Sentry}PerformanceTracker.ts',
  'core/sentry/data/services/SentryClient.ts',
  'core/storage/data/services/LocalStorage.ts',
  'trip-generation/useCases/Enrich*UseCase.ts',
  'trip-generation/state/**',
];

/**
 * ViewModels inside those that are not on Effect yet: they log through the deprecated `logger` or
 * navigate through the Inversify `navigationService`. #505 moves and tests them.
 */
const VIEWMODELS_UNTIL_505 = ['core/error/ui/**', 'trip-generation/ui/**'];

/**
 * The kit's Jest preset plus HolidAI's deltas:
 *
 * - `inversify` ships ES modules, and the core public APIs still load the container through the
 *   deprecated shims until #505 removes it. `__mocks__/@sentry/react-native.ts` keeps the Sentry
 *   SDK, which those APIs also load, from leaving a timer behind.
 * - `jestAfterEnv.ts` resets the router fake that `__mocks__/expo-router.ts` hands out.
 * - Coverage is measured over the Effect footprint, without its legacy files and ViewModels: the features still
 *   on Inversify have no tests until they move (#505), and #505 measures the whole tree.
 */
const config = {
  ...preset,
  transformIgnorePatterns: preset.transformIgnorePatterns.map(pattern =>
    pattern.replace(/(\/?node_modules\/\(\?!\()/, `$1${ESM_PACKAGES.join('|')}|`),
  ),
  setupFilesAfterEnv: ['<rootDir>/features/core/testing/jestAfterEnv.ts'],
  collectCoverageFrom: [
    `<rootDir>/features/${EFFECT_FOOTPRINT}/**/*.ts`,
    ...preset.collectCoverageFrom.slice(1),
    ...[...LEGACY_UNTIL_505, ...VIEWMODELS_UNTIL_505].map(path => `!<rootDir>/features/${path}`),
  ],
};

module.exports = config;
