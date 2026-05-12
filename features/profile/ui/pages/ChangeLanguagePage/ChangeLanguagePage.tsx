import { Routes } from '@/features/core/navigation';
import { LanguageItem } from '@/features/profile/ui/components/LanguageItem/LanguageItem';
import {
  Languages,
  useChangeLanguagePageLogic,
} from '@/features/profile/ui/pages/ChangeLanguagePage/ChangeLanguagePage.logic';
import { styles } from '@/features/profile/ui/pages/ChangeLanguagePage/ChangeLanguagePage.style';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';

export const ChangeLanguagePage = () => {
  const { changeLanguageHandler, selectedLanguage, isLoading } = useChangeLanguagePageLogic();

  return (
    <BasicView nameView={Routes.ChangeLanguage} statusBarStyle="dark">
      <View style={styles.container}>
        <LanguageItem
          language="CHANGE_LANGUAGE.BUTTON.EN"
          onPress={() => changeLanguageHandler(Languages.EN)}
          isSelected={selectedLanguage === Languages.EN}
          isLoading={isLoading}
        />
        <LanguageItem
          language="CHANGE_LANGUAGE.BUTTON.IT"
          onPress={() => changeLanguageHandler(Languages.IT)}
          isSelected={selectedLanguage === Languages.IT}
          isLoading={isLoading}
        />
      </View>
    </BasicView>
  );
};
