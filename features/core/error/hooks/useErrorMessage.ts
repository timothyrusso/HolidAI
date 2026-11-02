import { useErrorMessage as useMappedErrorMessage } from '@timothyrusso/effect-core/react';
import { useTranslation } from 'react-i18next';
import type { AppError } from '@/features/core/error/appError';
import { errorTagToMessageKey } from '@/features/core/error/mappers/errorTagToMessageKey';

/** The translated message for an app error, or `undefined` when there is none. */
export const useErrorMessage = (error: AppError | null | undefined): string | undefined => {
  const { t } = useTranslation();
  return useMappedErrorMessage(error, errorTagToMessageKey, key => t(key));
};
