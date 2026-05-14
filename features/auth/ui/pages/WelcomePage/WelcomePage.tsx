import { WelcomeCards } from '@/features/auth/ui/components/WelcomeCards/WelcomeCards';
import { useWelcomePageLogic } from '@/features/auth/ui/pages/WelcomePage/WelcomePage.logic';
import { styles } from '@/features/auth/ui/pages/WelcomePage/WelcomePage.style';
import { Routes } from '@/features/core/navigation';
import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import { CustomImage } from '@/ui/components/basic/CustomImage/CustomImage';
import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import { CustomScrollView } from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

export const WelcomePage = () => {
  const { handlePress, logoRound, subtitleAnimatedStyle } = useWelcomePageLogic();

  return (
    <BasicView nameView={Routes.Welcome} isFullScreen statusBarStyle="dark">
      <CustomScrollView>
        <View style={styles.contentContainer}>
          <WelcomeCards />
          <View style={styles.textContainer}>
            <CustomImage source={logoRound} style={styles.logoRound} useBlur={false} />
            <View style={styles.titleContainer}>
              <CustomText text="WELCOME.SUBTITLE_FIRST_LINE" style={styles.titleFirstLine} />
              <Animated.View style={subtitleAnimatedStyle}>
                <CustomText text="WELCOME.SUBTITLE_SECOND_LINE" style={styles.titleSecondLine} />
              </Animated.View>
            </View>
            <CustomButtonLarge
              title="WELCOME.BUTTON"
              onPress={handlePress}
              style={styles.button}
              buttonType={ButtonType.Main}
            />
          </View>
        </View>
      </CustomScrollView>
    </BasicView>
  );
};
