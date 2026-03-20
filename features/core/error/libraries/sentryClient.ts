import * as Sentry from '@sentry/react-native';

export const sentryClient = {
  captureException(error: Error, context?: Record<string, unknown>): void {
    Sentry.captureException(error, { extra: context });
  },
};
