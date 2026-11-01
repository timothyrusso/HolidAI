import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { useTranslation } from 'react-i18next';
import { saveLanguage } from '@/features/core/translations/useCases/language';

/**
 * The language the app shows, and `changeLanguage`, which switches to another one at once and
 * remembers it for the next launch.
 */
export const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const { mutate } = useEffectMutation({ mutationFn: saveLanguage });

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    mutate(language);
  };

  return { language: i18n.language, changeLanguage };
};
