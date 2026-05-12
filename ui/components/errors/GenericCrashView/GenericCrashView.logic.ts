import { logger } from '@/features/core/error';
import { type NavigationHref, navigationService } from '@/features/core/navigation';
import type { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';

type GenericCrashViewLogicProps = ErrorBoundaryProps & {
  redirectTo: NavigationHref;
};

export const useGenericCrashViewLogic = ({ error, retry, redirectTo }: GenericCrashViewLogicProps) => {
  const { t } = useTranslation();

  // Accepted exception to the "log only in useCases/" rule: error boundary components
  // receive raw errors from the React render tree with no use case in the call path.
  // Sentry already captures this via Sentry.wrap(); this log is for the dev console only.
  if (__DEV__) {
    logger.error(error, { source: 'GenericCrashView' });
  }

  const handleRetry = async () => {
    navigationService.replace(redirectTo);
    await retry();
  };

  const message = t('ERRORS.GENERIC');
  return { message, handleRetry, t };
};
