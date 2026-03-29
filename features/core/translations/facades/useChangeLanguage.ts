import { storage } from '@/features/core/storage';
import { TranslationKeys } from '@/features/core/translations/domain/entities/TranslationKeys';
import * as Localization from 'expo-localization';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const initialLanguage = Localization.getLocales()[0]?.languageCode ?? TranslationKeys.defaultLanguage;

  const loadLanguage = () => {
    const savedLanguage = storage.getString(TranslationKeys.storageLanguageKey);
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      i18n.changeLanguage(initialLanguage);
    }
    return savedLanguage ?? initialLanguage;
  };

  useEffect(() => {
    loadLanguage();
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    storage.set(TranslationKeys.storageLanguageKey, lang);
    i18n.changeLanguage(lang);
  };

  return { changeLanguage, loadLanguage };
};
