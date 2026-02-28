import { Routes } from '@/modules/navigation/domain/entities/routes';
import { Languages } from '@/modules/shared/domain/Languages';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';
import { useChangeLanguagePageLogic } from './ChangeLanguagePage.logic';
import { styles } from './ChangeLanguagePage.style';
import { LanguageItem } from './components/LanguageItem/LanguageItem';
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
