import { AppKeys } from '@/modules/shared/domain/AppKeys';
import type { Language } from '@/modules/shared/domain/Languages';
import { useChangeLanguage } from '@/ui/hooks/useChangeLanguage';
import { useEffect, useState } from 'react';

export const useChangeLanguagePageLogic = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(AppKeys.defaultLanguage);
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
