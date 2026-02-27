import { storage } from '@/di/resolve';
import { AppKeys } from '@/modules/shared/domain/AppKeys';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from '../en/en.json';
import translationIt from '../it/it.json';

const resources = {
  it: { translation: translationIt },
  en: { translation: translationEn },
};

const initI18n = () => {
  let savedLanguage = storage.getString(AppKeys.storageLanguageKey);

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode ?? AppKeys.defaultLanguage;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: savedLanguage,
    fallbackLng: AppKeys.defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
