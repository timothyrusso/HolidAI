import { useTranslation } from 'react-i18next';
import type { AppError, BaseError } from '@/features/core/error';
import { errorCodeToMessageKey, errorTagToMessageKey } from '@/features/core/error';
import { ToastType } from '@/features/core/toast/domain/entities/ToastType';
import { toastClient } from '@/features/core/toast/libraries/toastClient';

export const useToast = () => {
  const { t } = useTranslation();

  const showErrorToast = (error: BaseError | AppError): void => {
    const key =
      '_tag' in error ? errorTagToMessageKey[error._tag] : (errorCodeToMessageKey[error.code] ?? 'ERRORS.GENERIC');
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
