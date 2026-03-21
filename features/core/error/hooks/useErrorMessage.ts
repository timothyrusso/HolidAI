import { useTranslation } from 'react-i18next';
import type { BaseError } from '../domain/entities/BaseError';
import { errorCodeToMessageKey } from './errorCodeToMessageKey';

export const useErrorMessage = (error: BaseError | null): string | null => {
  const { t } = useTranslation();
  if (!error) return null;
  const messageKey = errorCodeToMessageKey[error.code] ?? 'ERRORS.GENERIC';
  return t(messageKey);
};
