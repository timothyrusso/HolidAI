import { type Language, Languages, useChangeLanguage } from '@/features/core/translations';

export { Languages };

export const useChangeLanguagePageLogic = () => {
  const { language, changeLanguage } = useChangeLanguage();

  return {
    state: {
      selectedLanguage: language,
    },
    effects: {
      changeLanguageHandler: (lang: Language) => changeLanguage(lang),
    },
  };
};
