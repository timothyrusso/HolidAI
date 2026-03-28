import { storage } from '@/features/core/storage';
import { TranslationKeys } from '@/features/core/translations/domain/entities/TranslationKeys';
import translationEn from '@/features/core/translations/libraries/locales/en.json';
import translationIt from '@/features/core/translations/libraries/locales/it.json';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  it: { translation: translationIt },
  en: { translation: translationEn },
};

export const initI18n = (): void => {
  let savedLanguage = storage.getString(TranslationKeys.storageLanguageKey);

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode ?? TranslationKeys.defaultLanguage;
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: TranslationKeys.defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
};

export { i18n };
