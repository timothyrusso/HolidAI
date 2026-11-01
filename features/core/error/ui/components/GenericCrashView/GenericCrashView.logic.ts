import type { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { type NavigationHref, navigationService } from '@/features/core/navigation';

type GenericCrashViewLogicProps = Pick<ErrorBoundaryProps, 'retry'> & {
  redirectTo: NavigationHref;
};

export const useGenericCrashViewLogic = ({ retry, redirectTo }: GenericCrashViewLogicProps) => {
  const { t } = useTranslation();

  const handleRetry = async () => {
    navigationService.replace(redirectTo);
    await retry();
  };

  const message = t('ERRORS.GENERIC');
  return {
    state: {
      message,
      t,
    },
    effects: {
      handleRetry,
    },
  };
};
