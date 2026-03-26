import { logger } from '@/features/core/error';
import type { ErrorBoundaryProps, Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

type GenericCrashViewLogicProps = ErrorBoundaryProps & {
  redirectTo: Href;
};

export const useGenericCrashViewLogic = ({ error, retry, redirectTo }: GenericCrashViewLogicProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Exception to the "log only in useCases/" rule — see ERROR_HANDLING.md Exceptions.
  // Sentry already captures this via Sentry.wrap(), so this log is for the dev console only.
  logger.error(error, { source: 'GenericCrashView' });

  const handleRetry = async () => {
    router.replace(redirectTo);
    await retry();
  };

  const message = t('ERRORS.GENERIC');
  return { message, handleRetry, t };
};
