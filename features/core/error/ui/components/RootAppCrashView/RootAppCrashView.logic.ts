import { logger } from '@/features/core/error/di/resolve';
import type { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const useRootAppCrashViewLogic = ({ error, retry }: ErrorBoundaryProps) => {
  const { t } = useTranslation();

  // Accepted exception to the "log only in useCases/" rule: error boundary components
  // receive raw errors from the React render tree with no use case in the call path.
  // Sentry already captures this via Sentry.wrap(); this log is for the dev console only.
  if (__DEV__) {
    logger.error(error, { source: 'RootAppCrashView' });
  }

  const message = t('ERRORS.GENERIC');
  return { message, retry, t };
};
