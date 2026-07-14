import { useEffect, useState } from 'react';
import { type Language, Languages, TranslationKeys, useChangeLanguage } from '@/features/core/translations';

export { Languages };

export const useChangeLanguagePageLogic = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(TranslationKeys.defaultLanguage);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { changeLanguage, loadLanguage } = useChangeLanguage();

  useEffect(() => {
    const loadLanguageHandler = async () => {
      const startingLanguage = await loadLanguage();
      setSelectedLanguage(startingLanguage as Language);
      setIsLoading(false);
    };
    loadLanguageHandler();
  }, []);

  const changeLanguageHandler = (lang: Language) => {
    changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  return { changeLanguageHandler, selectedLanguage, isLoading };
};
