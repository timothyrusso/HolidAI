import { useTranslation } from 'react-i18next';

export const useLocale = () => {
  const { i18n } = useTranslation();
  const getLanguage = () => i18n.language;

  return {
    locale: getLanguage(),
  };
};
