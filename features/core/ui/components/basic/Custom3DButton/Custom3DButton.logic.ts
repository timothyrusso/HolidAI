import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { fontFamily } from '@/features/core/ui/style/fontFamily';

export const CUSTOM_3D_BUTTON_DEFAULTS = {
  backgroundColor: '#000000',
  borderColor: '#01C5C0',
  borderWidth: 2,
  borderRadius: 8,
  raisedColor: '#018B87',
  raiseLevel: 6,
  height: 41,
  textColor: '#FFFFFF',
  textSize: 14,
  textFontFamily: fontFamily.interBold,
  iconSize: 18,
} as const;

const PRESS_IN_TIMING = { duration: 200, easing: Easing.out(Easing.cubic) };
const RELEASE_SPRING = { stiffness: 100, damping: 7, mass: 1 };
const TAP_MAX_DURATION = 100000;

type UseCustom3DButtonLogicParams = {
  onPress?: () => void;
  disabled: boolean;
  isLoading: boolean;
  raiseLevel: number;
};

export const useCustom3DButtonLogic = ({ onPress, disabled, isLoading, raiseLevel }: UseCustom3DButtonLogicParams) => {
  const pressProgress = useSharedValue(0);
  const isInteractive = !(disabled || isLoading);

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .enabled(isInteractive)
        .maxDuration(TAP_MAX_DURATION)
        .onBegin(() => {
          'worklet';
          pressProgress.value = withTiming(1, PRESS_IN_TIMING);
        })
        .onEnd(() => {
          'worklet';
          if (onPress) {
            scheduleOnRN(onPress);
          }
        })
        .onFinalize(() => {
          'worklet';
          pressProgress.value = withSpring(0, RELEASE_SPRING);
        }),
    [isInteractive, onPress, pressProgress],
  );

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = isLoading ? raiseLevel : Math.max(0, pressProgress.value * raiseLevel);
    return { transform: [{ translateY }] };
  });

  return { tapGesture, contentAnimatedStyle };
};
