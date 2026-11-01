import { useTranslation } from 'react-i18next';
import type { AppError } from '@/features/core/error';
import { errorTagToMessageKey } from '@/features/core/error';
import { ToastType } from '@/features/core/toast/domain/entities/ToastType';
import { toastClient } from '@/features/core/toast/libraries/toastClient';

export const useToast = () => {
  const { t } = useTranslation();

  const showErrorToast = (error: AppError): void => {
    toastClient.show({ type: ToastType.ERROR, text1: t(errorTagToMessageKey[error._tag]) });
  };

  const showSuccessToast = (key: string): void => {
    toastClient.show({ type: ToastType.SUCCESS, text1: t(key) });
  };

  const showInfoToast = (key: string): void => {
    toastClient.show({ type: ToastType.INFO, text1: t(key) });
  };

  return { showErrorToast, showSuccessToast, showInfoToast };
};
