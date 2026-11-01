import type { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const useRootAppCrashViewLogic = ({ retry }: Pick<ErrorBoundaryProps, 'retry'>) => {
  const { t } = useTranslation();

  const message = t('ERRORS.GENERIC');
  return {
    state: {
      message,
      t,
    },
    effects: {
      retry,
    },
  };
};
