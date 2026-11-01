import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { SentryLive } from '@/features/core/sentry/data/services/sentryLive';
export { Sentry, type SentrySpanOptions } from '@/features/core/sentry/domain/services/Sentry';
export {
  initSentry,
  registerNavigationContainer,
  reportBootFailure,
  wrap,
} from '@/features/core/sentry/libraries/sentryBindings';
