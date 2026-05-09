import type { PropsWithChildren } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { styles } from '@/ui/components/basic/CustomPressable/CustomPressable.style';

const SPRING_CONFIG = { damping: 500, stiffness: 1000, mass: 1 };

type CustomPressableProps = PropsWithChildren<
  Omit<PressableProps, 'style'> & {
    style?: StyleProp<ViewStyle>;
    scaleValue?: number;
  }
>;

export function CustomPressable({
  children,
  style,
  scaleValue = 0.9,
  onPressIn,
  onPressOut,
  ...rest
}: CustomPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Pressable
        style={[styles.pressable]}
        onPressIn={e => {
          scale.value = withSpring(scaleValue, SPRING_CONFIG);
          onPressIn?.(e);
        }}
        onPressOut={e => {
          scale.value = withSpring(1, SPRING_CONFIG);
          onPressOut?.(e);
        }}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
