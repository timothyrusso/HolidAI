import { logger } from '@/features/core/error';
import { TranslationKeys } from '@/features/core/translations';
import type { LocationInfo } from '@/features/trip-generation';
import { useTranslation } from 'react-i18next';

export type { LocationInfo };

export const usePlacesAutocompleteLogic = (placeholder: string) => {
  const { i18n, t } = useTranslation();

  return {
    translatedPlaceholder: t(placeholder),
    language: i18n.language ?? TranslationKeys.defaultLanguage,
    handleFail: (error: Error) => logger.error(error),
    handleTimeout: () => logger.warning('google places autocomplete: request timeout'),
  };
};
