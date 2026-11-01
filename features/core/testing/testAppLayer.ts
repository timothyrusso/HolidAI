import { makeAppRuntime } from '@timothyrusso/effect-core';
import { collectLogs } from '@timothyrusso/effect-core/testing';
import { Layer, TestContext } from 'effect';
import { AppConfig, type AppConfigValues } from '@/features/core/config';
import { PerformanceTracker } from '@/features/core/performance';

/** The config tests run with: every key present, none of them real. */
export const TEST_CONFIG: AppConfigValues = {
  convexUrl: 'https://happy-otter-123.convex.cloud',
  clerkPublishableKey: 'pk_test_holidai',
  mmkvEncryptionKey: 'holidai-test-encryption-key',
  googlePlacesApiKey: 'places-test-key',
  googleGeminiApiKey: 'gemini-test-key',
  rapidApiKey: 'rapid-test-key',
  unsplashAccessKey: 'unsplash-test-key',
  sentryDsn: 'https://public@o0.ingest.sentry.io/0',
};

/**
 * What the core provides in tests, in place of `AppLayer`'s core: a fixed config, a `Logger` that
 * collects, a `PerformanceTracker` that only runs the Effect, and Effect's `TestClock`. Build one
 * per test: the logs are its own.
 */
export const makeTestAppLayer = (config: AppConfigValues = TEST_CONFIG) => {
  const logs = collectLogs();
  const layer = Layer.mergeAll(
    logs.layer,
    AppConfig.layerOf(config),
    Layer.succeed(PerformanceTracker, { withSpan: (_options, effect) => effect }),
    TestContext.TestContext,
  );
  return { layer, logs };
};

/** What {@link makeTestAppLayer} provides: the services a feature Layer under test may need. */
export type CoreTestServices = Layer.Layer.Success<ReturnType<typeof makeTestAppLayer>['layer']>;

/**
 * A runtime for facade and hook tests: the given feature Layers over {@link makeTestAppLayer},
 * with the logs it records. Dispose it at the end of the test.
 */
export const makeTestRuntime = <R, E>(features: Layer.Layer<R, E, CoreTestServices>) => {
  const { layer, logs } = makeTestAppLayer();
  return { runtime: makeAppRuntime(features.pipe(Layer.provideMerge(layer))), logs };
};
