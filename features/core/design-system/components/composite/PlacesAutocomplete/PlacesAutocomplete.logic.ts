import { useTranslation } from 'react-i18next';
import type { Point } from 'react-native-google-places-autocomplete';
import { useReportFailure } from '@/features/core/logger';
import { TranslationKeys } from '@/features/core/translations';

export interface LocationInfo {
  name: string;
  coordinates: Point | undefined;
  photoRef: string | undefined;
  url: string | undefined;
}

export const usePlacesAutocompleteLogic = (placeholder: string) => {
  const { i18n, t } = useTranslation();
  const reportFailure = useReportFailure();

  return {
    state: {
      language: i18n.language ?? TranslationKeys.defaultLanguage,
    },
    derived: {
      translatedPlaceholder: t(placeholder),
    },
    effects: {
      handleFail: (error: Error) => reportFailure(error),
    },
  };
};
