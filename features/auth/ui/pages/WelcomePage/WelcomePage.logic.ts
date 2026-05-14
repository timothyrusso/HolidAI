import { navigationService } from '@/features/core/navigation';
import { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const logoRound = require('@/ui/assets/images/logo_round.png');

const SUBTITLE_ENTRANCE_DURATION = 600;
const SUBTITLE_ENTRANCE_DELAY = 300;

export const useWelcomePageLogic = () => {
  const handlePress = () => navigationService.toSignIn();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  opacity.value = withDelay(
    SUBTITLE_ENTRANCE_DELAY,
    withTiming(1, { duration: SUBTITLE_ENTRANCE_DURATION, easing: Easing.out(Easing.quad) }),
  );
  translateY.value = withDelay(
    SUBTITLE_ENTRANCE_DELAY,
    withTiming(0, { duration: SUBTITLE_ENTRANCE_DURATION, easing: Easing.out(Easing.quad) }),
  );

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return {
    handlePress,
    logoRound,
    subtitleAnimatedStyle,
  };
};
