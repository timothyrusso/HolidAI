import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TranslationKeys } from '@/features/core/translations/domain/entities/TranslationKeys';
import translationEn from '@/features/core/translations/libraries/locales/en.json';
import translationIt from '@/features/core/translations/libraries/locales/it.json';

const resources = {
  it: { translation: translationIt },
  en: { translation: translationEn },
};

/** The device's language, or the default one when the device names none. */
const deviceLanguage = (): string => Localization.getLocales()[0]?.languageCode ?? TranslationKeys.defaultLanguage;

/**
 * Starts i18n in the device's language. The language the user chose is in storage, which opens
 * with the runtime: {@link restoreLanguage} switches to it once the runtime has booted.
 */
export const initI18n = (): void => {
  if (i18n.isInitialized) return;

  i18n.use(initReactI18next).init({
    resources,
    lng: deviceLanguage(),
    fallbackLng: TranslationKeys.defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
};

/** Switches to the language the user chose, when they chose one. */
export const restoreLanguage = (language: string | undefined): void => {
  if (language) i18n.changeLanguage(language);
};

export { i18n };
