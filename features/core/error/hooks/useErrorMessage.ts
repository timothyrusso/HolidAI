import type { BaseError } from '@/features/core/error/domain/entities/BaseError';
import { errorCodeToMessageKey } from '@/features/core/error/hooks/errorCodeToMessageKey';
import { useTranslation } from 'react-i18next';

export const useErrorMessage = (error: BaseError | null): string | null => {
  const { t } = useTranslation();
  if (!error) return null;
  const messageKey = errorCodeToMessageKey[error.code] ?? 'ERRORS.GENERIC';
  return t(messageKey);
};
