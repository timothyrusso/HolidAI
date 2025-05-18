import { useTranslation } from 'react-i18next';

/**
 * Hook to get the current locale from the i18n library.
 * @returns The current locale.
 */
export const useLocale = () => {
  const { i18n } = useTranslation();
  const getLanguage = () => i18n.language;

  return {
    locale: getLanguage(),
  };
};
