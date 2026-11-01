import type { FeatureTier } from '@/features/core/featureTier';

/**
 * The composition root: Tier 5, so it may import every feature and no feature can import it.
 * Only `app/_layout.tsx` imports it.
 */
export const FEATURE_TIER: FeatureTier = 5;

export { AppLayer, type AppServices, runtime } from '@/features/core/runtime/runtime';
