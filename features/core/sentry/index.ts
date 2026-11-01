import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { SentryLive } from '@/features/core/sentry/data/services/sentryLive';
export { sentryClientFactory } from '@/features/core/sentry/di/factories/sentryClientFactory';
export { sentryClient } from '@/features/core/sentry/di/resolve';
export type { ISentryErrorClient } from '@/features/core/sentry/domain/entities/services/ISentryErrorClient';
export type { ISentryPerfClient } from '@/features/core/sentry/domain/entities/services/ISentryPerfClient';
export { Sentry, type SentrySpanOptions } from '@/features/core/sentry/domain/services/Sentry';
export {
  initSentry,
  registerNavigationContainer,
  reportBootFailure,
  wrap,
} from '@/features/core/sentry/libraries/sentryBindings';
