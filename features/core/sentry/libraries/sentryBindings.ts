import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import Constants from 'expo-constants';
import type React from 'react';

export const sentryNavigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
  routeChangeTimeoutMs: 1000,
  ignoreEmptyBackNavigationTransactions: true,
});

export const initSentry = (): void => {
  Sentry.init({
    dsn: Constants.expoConfig?.extra?.sentryDsn,
    sendDefaultPii: __DEV__,
    enableLogs: __DEV__,
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration(), sentryNavigationIntegration],
    enableNativeFramesTracking: !isRunningInExpoGo(),
  });
};

export const captureException = (error: Error, context?: Record<string, unknown>): void => {
  Sentry.captureException(error, { extra: context });
};

export const wrap = <P extends Record<string, unknown>>(component: React.ComponentType<P>): React.ComponentType<P> => {
  return Sentry.wrap(component);
};

export const startSpan = Sentry.startSpan;
export const setMeasurement = Sentry.setMeasurement;

export const registerNavigationContainer = (ref: unknown): void => {
  sentryNavigationIntegration.registerNavigationContainer(ref);
};
