import { logger } from '@/features/core/error';
import { type NavigationHref, navigationService } from '@/features/core/navigation';
import type { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';

type GenericCrashViewLogicProps = ErrorBoundaryProps & {
  redirectTo: NavigationHref;
};

export const useGenericCrashViewLogic = ({ error, retry, redirectTo }: GenericCrashViewLogicProps) => {
  const { t } = useTranslation();

  // Exception to the "log only in useCases/" rule — see ERROR_HANDLING.md Exceptions.
  // Sentry already captures this via Sentry.wrap(), so this log is for the dev console only.
  if (__DEV__) {
    logger.error(error, { source: 'GenericCrashView' });
  }

  const handleRetry = () => {
    navigationService.replace(redirectTo);
    retry();
  };

  const message = t('ERRORS.GENERIC');
  return { message, handleRetry, t };
};
