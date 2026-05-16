import { logger } from '@/features/core/error';
import { TranslationKeys } from '@/features/core/translations';
import { useTranslation } from 'react-i18next';
import type { Point } from 'react-native-google-places-autocomplete';

export interface LocationInfo {
  name: string;
  coordinates: Point | undefined;
  photoRef: string | undefined;
  url: string | undefined;
}

export const usePlacesAutocompleteLogic = (placeholder: string) => {
  const { i18n, t } = useTranslation();

  return {
    translatedPlaceholder: t(placeholder),
    language: i18n.language ?? TranslationKeys.defaultLanguage,
    // Accepted exception to the "log only in useCases/" rule: these callbacks are
    // SDK error hooks from GooglePlacesAutocomplete with no use case in the call path.
    // The same rationale applies as for error boundary components.
    handleFail: (error: Error) => logger.error(error),
    handleTimeout: () => logger.warning('google places autocomplete: request timeout'),
  };
};
