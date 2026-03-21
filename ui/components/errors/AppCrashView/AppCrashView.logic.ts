import { logger } from '@/features/core/error';
import type { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const useAppCrashViewLogic = ({ error, retry }: ErrorBoundaryProps) => {
  const { t } = useTranslation();

  // Exception to the "log only in useCases/" rule — see ERROR_HANDLING.md Exceptions.
  // Sentry already captures this via Sentry.wrap(), so this log is for the dev console only.
  logger.error(error, { source: 'AppCrashView' });

  const message = t('ERRORS.GENERIC');
  return { message, retry, t };
};
