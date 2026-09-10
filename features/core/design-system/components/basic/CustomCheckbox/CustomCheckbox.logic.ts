import { useEffect, useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors } from '@/features/core/design-system/style/colors';
import { type CheckboxSizeName, checkboxSizes } from '@/features/core/design-system/style/dimensions/checkbox';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { icons } from '@/features/core/design-system/style/icons';
import { opacity } from '@/features/core/design-system/style/opacity';

export const CheckboxState = {
  checked: 'checked',
  unchecked: 'unchecked',
  empty: 'empty',
} as const;

export type CheckboxState = (typeof CheckboxState)[keyof typeof CheckboxState];

export const CheckboxColor = {
  purple500: 'purple500',
  lime500: 'lime500',
  red500: 'red500',
  cyan500: 'cyan500',
  primaryBlack: 'primaryBlack',
  primaryWhite: 'primaryWhite',
} as const;

export type CheckboxColor = (typeof CheckboxColor)[keyof typeof CheckboxColor];

export type CheckboxCheckedColors = {
  fill: string;
  checkmark: string;
};

// Exhaustive on purpose: a colour added to the union without a checkmark decision fails to compile
// here rather than rendering a checkmark nobody can see against its own fill.
const checkboxCheckedColors: Record<CheckboxColor, CheckboxCheckedColors> = {
  [CheckboxColor.purple500]: { fill: colors.purple500, checkmark: colors.primaryWhite },
  [CheckboxColor.lime500]: { fill: colors.lime500, checkmark: colors.primaryBlack },
  [CheckboxColor.red500]: { fill: colors.red500, checkmark: colors.primaryWhite },
  [CheckboxColor.cyan500]: { fill: colors.cyan500, checkmark: colors.primaryBlack },
  [CheckboxColor.primaryBlack]: { fill: colors.primaryBlack, checkmark: colors.primaryWhite },
  [CheckboxColor.primaryWhite]: { fill: colors.primaryWhite, checkmark: colors.primaryBlack },
};

type CheckboxBaseProps = {
  state: CheckboxState;
  size?: CheckboxSizeName;
  /** Takes effect on `checked` only: `unchecked` and `empty` are neutral whatever is passed. */
  color?: CheckboxColor;
  style?: StyleProp<ViewStyle>;
};

type CheckboxStaticProps = {
  onChange?: never;
  accessibilityLabel?: string;
};

type CheckboxInteractiveProps = {
  /** Passing a handler is what makes the checkbox interactive; omitting it renders the static one. */
  onChange: (next: boolean) => void;
  /** Required: the control carries no adjacent text for a screen reader to fall back on. */
  accessibilityLabel: string;
};

export type CustomCheckboxProps =
  | (CheckboxBaseProps & CheckboxStaticProps)
  | (CheckboxBaseProps & CheckboxInteractiveProps);

const DEFAULT_SIZE: CheckboxSizeName = 'medium';
const DEFAULT_COLOR: CheckboxColor = CheckboxColor.purple500;
const UNCHECKED = 0;
const CHECKED = 1;
const CHECKMARK_START_SCALE = 0.6;
const FULL_SCALE = 1;
const EMPTY_DASH_PATTERN = [spacing.MinimalDouble, spacing.MinimalDouble];
// Matches `CustomSegmentedControl`: settles in ~250-300ms with a slight overshoot. Every read of it
// clamps, so the overshoot never pushes an opacity or a border width out of its valid range.
const CHECK_SPRING = { damping: 22, stiffness: 220, mass: 1 };

export const useCustomCheckboxLogic = (props: CustomCheckboxProps) => {
  const { state, size = DEFAULT_SIZE, color = DEFAULT_COLOR, onChange } = props;
  const { box, glyph, strokeWidth, slop } = checkboxSizes[size];
  const prefersReducedMotion = useReducedMotion();

  const isChecked = state === CheckboxState.checked;
  const isEmpty = state === CheckboxState.empty;
  const isInteractive = onChange !== undefined;
  const checkedColors = checkboxCheckedColors[color];

  // Seeded with the state the checkbox is rendered in, so the mount pass springs to the value it
  // already holds and a checkbox mounted checked paints checked on the first frame.
  const checkProgress = useSharedValue(isChecked ? CHECKED : UNCHECKED);
  const previousState = useRef(state);

  useEffect(() => {
    // A `[4, 4]` dash has nothing to interpolate into a solid fill, and a dashed ring morphing into
    // one reads as a glitch, so every transition touching `empty` cuts instead.
    const skipsAnimation =
      prefersReducedMotion || state === CheckboxState.empty || previousState.current === CheckboxState.empty;
    previousState.current = state;

    const target = state === CheckboxState.checked ? CHECKED : UNCHECKED;
    checkProgress.value = skipsAnimation ? target : withSpring(target, CHECK_SPRING);
  }, [state, prefersReducedMotion, checkProgress]);

  // The ring's outer edge stays on the box while its border thickens to the radius, so it fills
  // inward into a solid disc; the colour crosses on the same value, so the two cannot drift apart.
  // A border rather than an SVG stroke: react-native-web never applies an animated `stroke`
  // attribute, which froze the ring on its checked colour on every transition back out of it.
  const ringAnimatedStyle = useAnimatedStyle(() => ({
    borderWidth: interpolate(checkProgress.value, [UNCHECKED, CHECKED], [strokeWidth, box / 2], Extrapolation.CLAMP),
    borderColor: interpolateColor(checkProgress.value, [UNCHECKED, CHECKED], [colors.tertiaryGrey, checkedColors.fill]),
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      checkProgress.value,
      [UNCHECKED, CHECKED],
      [opacity.opacity0, opacity.opacity100],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          checkProgress.value,
          [UNCHECKED, CHECKED],
          [CHECKMARK_START_SCALE, FULL_SCALE],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const onPress = () => onChange?.(!isChecked);

  return {
    derived: {
      box,
      glyph,
      strokeWidth,
      center: box / 2,
      radius: (box - strokeWidth) / 2,
      isEmpty,
      isInteractive,
      isChecked,
      neutralRingColor: colors.tertiaryGrey,
      // A white fill is invisible on a white surface, so that one variant keeps a neutral ring; the
      // dashed `empty` ring must not be overdrawn by it.
      hasNeutralOutline: color === CheckboxColor.primaryWhite && !isEmpty,
      dashArray: EMPTY_DASH_PATTERN,
      glyphName: isEmpty ? icons.add : icons.checkmark,
      glyphColor: isEmpty ? colors.tertiaryGrey : checkedColors.checkmark,
      ringAnimatedStyle,
      checkmarkAnimatedStyle,
      slop,
      // Static stays in the a11y tree, dimmed rather than hidden: its value is still worth hearing.
      accessibilityState: { checked: isChecked, disabled: !isInteractive },
    },
    effects: {
      onPress,
    },
  };
};
