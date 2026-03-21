import type { BaseError } from '@/features/core/error';
import { errorCodeToMessageKey } from '@/features/core/error';
import { ToastType } from '@/features/core/toast/domain/entities/ToastType';
import { toastClient } from '@/features/core/toast/libraries/toastClient';
import { useTranslation } from 'react-i18next';

export const useToast = () => {
  const { t } = useTranslation();

  const showErrorToast = (error: BaseError): void => {
    const key = errorCodeToMessageKey[error.code] ?? 'ERRORS.GENERIC';
    toastClient.show({ type: ToastType.ERROR, text1: t(key) });
  };

  const showSuccessToast = (key: string): void => {
    toastClient.show({ type: ToastType.SUCCESS, text1: t(key) });
  };

  const showInfoToast = (key: string): void => {
    toastClient.show({ type: ToastType.INFO, text1: t(key) });
  };

  return { showErrorToast, showSuccessToast, showInfoToast };
};
