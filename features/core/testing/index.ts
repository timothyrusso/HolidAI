import type { FeatureTier } from '@/features/core/featureTier';

/** Shared test Layers and helpers. Import only from tests. */
export const FEATURE_TIER: FeatureTier = 0;

export { advanceClock, collectLogs, itEffect } from '@timothyrusso/effect-core/testing';
export { renderWithLayer } from '@/features/core/testing/renderWithLayer';
export { routerFake } from '@/features/core/testing/routerFake';
export { makeTestAppLayer, makeTestRuntime, TEST_CONFIG } from '@/features/core/testing/testAppLayer';
export { makeTestWrapper } from '@/features/core/testing/testWrapper';
