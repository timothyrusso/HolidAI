import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export {
  initSentry,
  registerNavigationContainer,
  wrap,
} from '@/features/core/sentry/libraries/sentryBindings';

export { sentryClient } from '@/features/core/sentry/di/resolve';
export { sentryClientFactory } from '@/features/core/sentry/di/factories/sentryClientFactory';
export type { ISentryErrorClient } from '@/features/core/sentry/domain/entities/services/ISentryErrorClient';
export type { ISentryPerfClient } from '@/features/core/sentry/domain/entities/services/ISentryPerfClient';
