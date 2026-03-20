import type { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const useAppCrashViewLogic = ({ retry }: ErrorBoundaryProps) => {
  const { t } = useTranslation();
  const message = t('ERRORS.GENERIC');
  return { message, retry, t };
};
