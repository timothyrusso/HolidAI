import type { FeatureTier } from '@/features/core/featureTier';

/** Shared test Layers and helpers. Import only from tests. */
export const FEATURE_TIER: FeatureTier = 0;

export { advanceClock, collectLogs, itEffect } from '@timothyrusso/effect-core/testing';
export { A_CLERK_USER, type ClerkUserFake, clerkFake } from '@/features/core/testing/clerkFake';
export { convexFake } from '@/features/core/testing/convexFake';
export { ImageRepositoryFake } from '@/features/core/testing/imageRepositoryFake';
export { NetworkFake } from '@/features/core/testing/networkFake';
export { renderWithLayer } from '@/features/core/testing/renderWithLayer';
export { routerFake } from '@/features/core/testing/routerFake';
export { StorageFake } from '@/features/core/testing/storageFake';
export { makeTestAppLayer, makeTestRuntime, NoFeatures, TEST_CONFIG } from '@/features/core/testing/testAppLayer';
export { makeTestWrapper } from '@/features/core/testing/testWrapper';
