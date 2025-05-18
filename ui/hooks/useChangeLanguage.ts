import { storage } from '@/di/resolve';
import { AppKeys } from '@/modules/shared/domain/AppKeys';
import * as Localization from 'expo-localization';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const initialLanguage = Localization.getLocales()[0].languageCode ?? AppKeys.defaultLanguage;

  const loadLanguage = () => {
    const savedLanguage = storage.getString(AppKeys.storageLanguageKey);
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
    storage.set(AppKeys.storageLanguageKey, lang);
    i18n.changeLanguage(lang);
  };

  return { changeLanguage, loadLanguage };
};
