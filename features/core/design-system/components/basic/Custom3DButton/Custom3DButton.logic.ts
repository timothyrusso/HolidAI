import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccessibilityActionEvent, AccessibilityActionInfo, AccessibilityActionName } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { match } from 'ts-pattern';

import { ButtonState } from '@/features/core/design-system/components/basic/CustomButton/CustomButton.logic';
import { spinnerColorForContent } from '@/features/core/design-system/components/basic/CustomSpinner/CustomSpinner.logic';
import { colors } from '@/features/core/design-system/style/colors';
import { opacity } from '@/features/core/design-system/style/opacity';

export const Custom3DButtonType = {
  Main: 'main',
  Primary: 'primary',
  Secondary: 'secondary',
  Accent: 'accent',
  Danger: 'danger',
  Info: 'info',
} as const;

export type Custom3DButtonType = (typeof Custom3DButtonType)[keyof typeof Custom3DButtonType];

export type Custom3DButtonColors = {
  faceColor: string;
  raisedColor: string;
  borderColor: string;
  contentColor: string;
};

const PRESS_IN_TIMING = { duration: 200, easing: Easing.out(Easing.cubic) };
const RELEASE_SPRING = { stiffness: 100, damping: 7, mass: 1 };
const TAP_MAX_DURATION = 100000;
const AT_REST = 0;

const ACTIVATE_ACTION: AccessibilityActionName = 'activate';
const ACCESSIBILITY_ACTIONS: readonly AccessibilityActionInfo[] = [{ name: ACTIVATE_ACTION }];

const resolveButtonColors = (buttonType: Custom3DButtonType, buttonState: ButtonState): Custom3DButtonColors =>
  match({ buttonType, buttonState })
    .with({ buttonType: Custom3DButtonType.Main, buttonState: ButtonState.Active }, () => ({
      faceColor: colors.purple500,
      raisedColor: colors.purple700,
      borderColor: colors.purple700,
      contentColor: colors.primaryWhite,
    }))
    .with({ buttonType: Custom3DButtonType.Main, buttonState: ButtonState.Disabled }, () => ({
      faceColor: colors.purple300,
      raisedColor: colors.purple700,
      borderColor: colors.purple700,
      contentColor: colors.primaryWhiteDisabled,
    }))
    .with({ buttonType: Custom3DButtonType.Primary, buttonState: ButtonState.Active }, () => ({
      faceColor: colors.primaryBlack,
      raisedColor: colors.cyan900,
      borderColor: colors.cyan700,
      contentColor: colors.primaryWhite,
    }))
    .with({ buttonType: Custom3DButtonType.Primary, buttonState: ButtonState.Disabled }, () => ({
      faceColor: colors.primaryGrey,
      raisedColor: colors.cyan900,
      borderColor: colors.cyan700,
      contentColor: colors.primaryWhiteDisabled,
    }))
    .with({ buttonType: Custom3DButtonType.Secondary, buttonState: ButtonState.Active }, () => ({
      faceColor: colors.primaryWhite,
      raisedColor: colors.secondaryGrey,
      borderColor: colors.secondaryGrey,
      contentColor: colors.primaryBlack,
    }))
    .with({ buttonType: Custom3DButtonType.Secondary, buttonState: ButtonState.Disabled }, () => ({
      faceColor: colors.primaryWhiteDisabled,
      raisedColor: colors.secondaryGrey,
      borderColor: colors.secondaryGrey,
      contentColor: colors.primaryGrey,
    }))
    .with({ buttonType: Custom3DButtonType.Accent, buttonState: ButtonState.Active }, () => ({
      faceColor: colors.lime500,
      raisedColor: colors.lime700,
      borderColor: colors.lime700,
      contentColor: colors.primaryBlack,
    }))
    .with({ buttonType: Custom3DButtonType.Accent, buttonState: ButtonState.Disabled }, () => ({
      faceColor: colors.lime300,
      raisedColor: colors.lime700,
      borderColor: colors.lime700,
      contentColor: colors.primaryGrey,
    }))
    .with({ buttonType: Custom3DButtonType.Danger, buttonState: ButtonState.Active }, () => ({
      faceColor: colors.red500,
      raisedColor: colors.red700,
      borderColor: colors.red700,
      contentColor: colors.primaryWhite,
    }))
    .with({ buttonType: Custom3DButtonType.Danger, buttonState: ButtonState.Disabled }, () => ({
      faceColor: colors.red300,
      raisedColor: colors.red700,
      borderColor: colors.red700,
      contentColor: colors.primaryWhiteDisabled,
    }))
    .with({ buttonType: Custom3DButtonType.Info, buttonState: ButtonState.Active }, () => ({
      faceColor: colors.cyan500,
      raisedColor: colors.cyan700,
      borderColor: colors.cyan700,
      contentColor: colors.primaryBlack,
    }))
    .with({ buttonType: Custom3DButtonType.Info, buttonState: ButtonState.Disabled }, () => ({
      faceColor: colors.cyan300,
      raisedColor: colors.cyan700,
      borderColor: colors.cyan700,
      contentColor: colors.primaryGrey,
    }))
    .exhaustive();

type UseCustom3DButtonLogicParams = {
  onPress: () => void;
  buttonType: Custom3DButtonType;
  isDisabled: boolean;
  isLoading: boolean;
  raiseLevel: number;
};

export const useCustom3DButtonLogic = ({
  onPress,
  buttonType,
  isDisabled,
  isLoading,
  raiseLevel,
}: UseCustom3DButtonLogicParams) => {
  const { t } = useTranslation();
  const pressProgress = useSharedValue(AT_REST);
  const isInteractive = !(isDisabled || isLoading);

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
          scheduleOnRN(onPress);
        })
        .onFinalize(() => {
          'worklet';
          pressProgress.value = withSpring(AT_REST, RELEASE_SPRING);
        }),
    [isInteractive, onPress, pressProgress],
  );

  const activate = () => {
    if (!isInteractive) return;
    onPress();
  };

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName !== ACTIVATE_ACTION) return;
    activate();
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(AT_REST, pressProgress.value * raiseLevel) }],
  }));

  const pressOverlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: Math.max(AT_REST, pressProgress.value * opacity.opacity20),
  }));

  const buttonState = isDisabled ? ButtonState.Disabled : ButtonState.Active;

  const buttonColors = resolveButtonColors(buttonType, buttonState);

  const spinnerColor = spinnerColorForContent(resolveButtonColors(buttonType, ButtonState.Active).contentColor);

  return {
    state: {
      t,
    },
    derived: {
      tapGesture,
      contentAnimatedStyle,
      pressOverlayAnimatedStyle,
      buttonColors,
      spinnerColor,
      isInteractive,
      accessibilityActions: ACCESSIBILITY_ACTIONS,
    },
    effects: {
      onAccessibilityTap: activate,
      onAccessibilityAction,
    },
  };
};
