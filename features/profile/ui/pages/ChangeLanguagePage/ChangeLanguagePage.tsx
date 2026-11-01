import { View } from 'react-native';
import { BasicView } from '@/features/core/design-system';
import { Routes } from '@/features/core/navigation';
import { LanguageItem } from '@/features/profile/ui/components/LanguageItem/LanguageItem';
import {
  Languages,
  useChangeLanguagePageLogic,
} from '@/features/profile/ui/pages/ChangeLanguagePage/ChangeLanguagePage.logic';
import { styles } from '@/features/profile/ui/pages/ChangeLanguagePage/ChangeLanguagePage.style';

export const ChangeLanguagePage = () => {
  const { state, effects } = useChangeLanguagePageLogic();

  return (
    <BasicView nameView={Routes.ChangeLanguage} statusBarStyle="dark">
      <View style={styles.container}>
        <LanguageItem
          language="CHANGE_LANGUAGE.BUTTON.EN"
          onPress={() => effects.changeLanguageHandler(Languages.EN)}
          isSelected={state.selectedLanguage === Languages.EN}
        />
        <LanguageItem
          language="CHANGE_LANGUAGE.BUTTON.IT"
          onPress={() => effects.changeLanguageHandler(Languages.IT)}
          isSelected={state.selectedLanguage === Languages.IT}
        />
      </View>
    </BasicView>
  );
};
