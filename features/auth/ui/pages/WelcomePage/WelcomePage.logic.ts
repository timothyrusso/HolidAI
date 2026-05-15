import { navigationService } from '@/features/core/navigation';
import { SCREEN_HEIGHT } from '@/ui/style/dimensions/spacing';
import { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const logoRound = require('@/ui/assets/images/logo_round.png');

const SUBTITLE_ENTRANCE_DURATION = 600;
const SUBTITLE_ENTRANCE_DELAY = 400;
const CARDS_EXIT_DURATION = 150;
const CENTER_ANIMATION_DURATION = 800;

export const useWelcomePageLogic = () => {
  const cardsTranslateY = useSharedValue(0);
  const textTranslateY = useSharedValue(0);
  const textElementsOpacity = useSharedValue(1);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(12);

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardsTranslateY.value }],
  }));

  const textContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
  }));

  const textElementsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textElementsOpacity.value,
  }));

  subtitleOpacity.value = withDelay(
    SUBTITLE_ENTRANCE_DELAY,
    withTiming(1, { duration: SUBTITLE_ENTRANCE_DURATION, easing: Easing.out(Easing.quad) }),
  );

  subtitleTranslateY.value = withDelay(
    SUBTITLE_ENTRANCE_DELAY,
    withTiming(0, { duration: SUBTITLE_ENTRANCE_DURATION, easing: Easing.out(Easing.quad) }),
  );

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const handlePress = () => {
    cardsTranslateY.value = withTiming(-SCREEN_HEIGHT, {
      duration: CARDS_EXIT_DURATION,
      easing: Easing.in(Easing.quad),
    });

    textElementsOpacity.value = withTiming(0, { duration: CARDS_EXIT_DURATION, easing: Easing.in(Easing.quad) });

    textTranslateY.value = withDelay(
      CARDS_EXIT_DURATION,
      withTiming(-(SCREEN_HEIGHT / 7), { duration: CENTER_ANIMATION_DURATION, easing: Easing.inOut(Easing.quad) }),
    );

    setTimeout(() => navigationService.toSignIn(), CARDS_EXIT_DURATION + CENTER_ANIMATION_DURATION);
  };

  return {
    handlePress,
    logoRound,
    subtitleAnimatedStyle,
    cardsAnimatedStyle,
    textContainerAnimatedStyle,
    textElementsAnimatedStyle,
  };
};
