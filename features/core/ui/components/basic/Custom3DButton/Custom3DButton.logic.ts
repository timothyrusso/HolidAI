import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { fontFamily } from '@/features/core/ui/style/fontFamily';

// PRIMARY spec — used as the component defaults so a bare <Custom3DButton> renders the target look.
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

// Press-in: ~200ms ease-out translate down (mirrors the library's ANIMATED_TIMING_IN + Easing.out(cubic)).
const PRESS_IN_TIMING = { duration: 200, easing: Easing.out(Easing.cubic) };
// Release: spring tuned by eye to feel like the library's Animated spring (tension 100 / friction 6.75).
const RELEASE_SPRING = { stiffness: 100, damping: 7, mass: 1 };
// Allow press-and-hold: a slow release still counts as a tap.
const TAP_MAX_DURATION = 100000;

type UseCustom3DButtonLogicParams = {
  onPress?: () => void;
  disabled: boolean;
  isLoading: boolean;
  raiseLevel: number;
};

export const useCustom3DButtonLogic = ({ onPress, disabled, isLoading, raiseLevel }: UseCustom3DButtonLogicParams) => {
  // 0 = raised (rest), 1 = pushed down (top face meets the bottom face).
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
            runOnJS(onPress)();
          }
        })
        .onFinalize(() => {
          'worklet';
          pressProgress.value = withSpring(0, RELEASE_SPRING);
        }),
    [isInteractive, onPress, pressProgress],
  );

  const contentAnimatedStyle = useAnimatedStyle(() => {
    // While loading the button rests flat (top face down, no animation).
    const translateY = isLoading ? raiseLevel : pressProgress.value * raiseLevel;
    return { transform: [{ translateY }] };
  });

  return { tapGesture, contentAnimatedStyle };
};
