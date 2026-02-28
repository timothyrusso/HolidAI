import { useRef } from 'react';
import type { ScrollView } from 'react-native';

import { useGradualKeyboardAnimation } from '@/modules/shared/hooks/useGradualKeyboardAnimation';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useCustomScrollViewLogic = (resetScroll = false) => {
  const { height } = useGradualKeyboardAnimation();
  const { bottom } = useSafeAreaInsets();

  const scrollViewRef = useRef<ScrollView | null>(null);

  const scrollToTop = () => {
    if (resetScroll && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  const keyboardViewStyle = useAnimatedStyle(() => {
    const keyboardHeight = Math.abs(height.value);
    return {
      height: keyboardHeight - bottom,
    };
  }, []);

  return {
    scrollViewRef,
    keyboardViewStyle,
    scrollToTop,
  };
};
