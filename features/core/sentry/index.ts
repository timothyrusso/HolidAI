export {
  initSentry,
  registerNavigationContainer,
  wrap,
} from '@/features/core/sentry/libraries/sentryBindings';

export { sentryClient } from '@/features/core/sentry/di/resolve';
export type { ISentryErrorClient } from '@/features/core/sentry/domain/entities/services/ISentryErrorClient';
export type { ISentryPerfClient } from '@/features/core/sentry/domain/entities/services/ISentryPerfClient';
