import { WelcomeCards } from '@/features/auth/ui/components/WelcomeCards/WelcomeCards';
import { useWelcomePageLogic } from '@/features/auth/ui/pages/WelcomePage/WelcomePage.logic';
import { styles } from '@/features/auth/ui/pages/WelcomePage/WelcomePage.style';
import { Routes } from '@/features/core/navigation';
import {
  BasicView,
  ButtonType,
  CustomButtonLarge,
  CustomImage,
  CustomScrollView,
  CustomText,
} from '@/features/core/ui';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

export const WelcomePage = () => {
  const {
    handlePress,
    logoRound,
    subtitleAnimatedStyle,
    cardsAnimatedStyle,
    textContainerAnimatedStyle,
    textElementsAnimatedStyle,
  } = useWelcomePageLogic();

  return (
    <BasicView nameView={Routes.Welcome} isFullScreen statusBarStyle="dark">
      <CustomScrollView>
        <View style={styles.contentContainer}>
          <Animated.View style={cardsAnimatedStyle}>
            <WelcomeCards />
          </Animated.View>
          <Animated.View style={[styles.textContainer, textContainerAnimatedStyle]}>
            <CustomImage source={logoRound} style={styles.logoRound} useBlur={false} />
            <Animated.View style={textElementsAnimatedStyle}>
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
            </Animated.View>
          </Animated.View>
        </View>
      </CustomScrollView>
    </BasicView>
  );
};
