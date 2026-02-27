import { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { match } from 'ts-pattern';

import { PlatformOS } from '@/ui/device/PlatformOS';
import useKeyboardEffect from '@/ui/hooks/useKeyboardEffect';
import { SCREEN_HEIGHT } from '@/ui/style/dimensions/spacing';
import { DefaultAnimationDurationMs } from '../../animations';

export const useModalTemplateContainerLogic = (maxHeight?: number) => {
  const { paddingHeight, keyboardHeight, isKeyboardVisible } = useKeyboardEffect(true);
  const { top, bottom } = useSafeAreaInsets();

  const baseMaxHeight = Platform.OS === PlatformOS.android ? (maxHeight ?? SCREEN_HEIGHT - top) : SCREEN_HEIGHT - top;
  const animatedMaxHeight = useRef(new Animated.Value(baseMaxHeight)).current;

  useEffect(() => {
    const maxHeight = match({ isKeyboardVisible, os: Platform.OS })
      .with({ os: PlatformOS.android, isKeyboardVisible: true }, () => baseMaxHeight + keyboardHeight)
      .otherwise(() => baseMaxHeight);

    Animated.timing(animatedMaxHeight, {
      toValue: maxHeight,
      duration: DefaultAnimationDurationMs,
      useNativeDriver: false,
    }).start();
  }, [isKeyboardVisible, keyboardHeight]);

  const containerStyle = {
    ...(Platform.OS === PlatformOS.android && { height: animatedMaxHeight }),
    ...(Platform.OS === PlatformOS.ios && { maxHeight: animatedMaxHeight }),
    paddingBottom: isKeyboardVisible ? paddingHeight : bottom,
  };

  return {
    containerStyle,
  };
};
