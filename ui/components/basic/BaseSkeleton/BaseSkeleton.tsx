import { colors } from '@/ui/constants/style/colors';
import { type ReactElement, useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export type BaseSkeletonProps = {
  children?: ReactElement;
  style?: StyleProp<ViewStyle>;
};

export const BaseSkeleton = ({ children, style }: BaseSkeletonProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true,
    );

    return () => cancelAnimation(opacity);
  }, []);

  const animatedStyleParent = useAnimatedStyle(() => {
    return { opacity: opacity.value, backgroundColor: colors.primaryGrey };
  });

  return <Animated.View style={[animatedStyleParent, style]}>{children}</Animated.View>;
};
