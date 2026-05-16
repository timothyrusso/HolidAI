import { colors } from '@/features/core/ui/style/colors';
import { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export const useBaseSkeletonLogic = () => {
  const opacity = useSharedValue(1);
  opacity.value = withRepeat(
    withTiming(0.3, { duration: 1000, easing: Easing.linear }),
    -1,
    true,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: colors.primaryGrey,
  }));

  return { animatedStyle };
};
