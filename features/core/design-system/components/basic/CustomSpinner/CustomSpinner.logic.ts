import type { StyleProp, ViewStyle } from 'react-native';

import { colors } from '@/features/core/design-system/style/colors';
import {
  type SpinnerSize,
  type SpinnerSizeName,
  spinnerSizes,
} from '@/features/core/design-system/style/dimensions/spinner';
import { opacity } from '@/features/core/design-system/style/opacity';

export const SpinnerColor = {
  purple500: 'purple500',
  lime500: 'lime500',
  red500: 'red500',
  cyan500: 'cyan500',
  primaryBlack: 'primaryBlack',
  primaryWhite: 'primaryWhite',
} as const;

export type SpinnerColor = (typeof SpinnerColor)[keyof typeof SpinnerColor];

export const spinnerColorForContent = (contentColor: string): SpinnerColor =>
  contentColor === colors.primaryWhite ? SpinnerColor.primaryWhite : SpinnerColor.primaryBlack;

export type SpinnerColors = {
  arc: string;
  track: string;
  trackOpacity: number;
};

export type CustomSpinnerProps = {
  size?: SpinnerSizeName;
  color?: SpinnerColor;
  /** Omitted spins an indeterminate 270° arc; provided renders a static arc, clamped to 0–1. */
  progress?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const NO_SWEEP = 0;
const FULL_SWEEP = 1;
const MIN_PERCENT = 0;
const MAX_PERCENT = 100;
const FULL_TURN_DEGREES = 360;
const INDETERMINATE_SWEEP_DEGREES = 270;
const ARC_START_ANGLE = -90;

export const spinnerRadius = ({ box, strokeWidth }: SpinnerSize) => (box - strokeWidth) / 2;

export const spinnerCircumference = (radius: number) => 2 * Math.PI * radius;

export const spinnerDashLength = (radius: number, sweep: number) => spinnerCircumference(radius) * sweep;

export const clampProgress = (progress: number) =>
  Number.isNaN(progress) ? NO_SWEEP : Math.min(Math.max(progress, NO_SWEEP), FULL_SWEEP);

export const spinnerSweep = (progress?: number) =>
  progress === undefined ? INDETERMINATE_SWEEP_DEGREES / FULL_TURN_DEGREES : clampProgress(progress);

export const spinnerPercent = (sweep: number) => Math.round(sweep * MAX_PERCENT);

type UseCustomSpinnerLogicParams = {
  size: SpinnerSizeName;
  color: SpinnerColor;
  progress?: number;
};

export const useCustomSpinnerLogic = ({ size, color, progress }: UseCustomSpinnerLogicParams) => {
  const { box, strokeWidth } = spinnerSizes[size];
  const center = box / 2;
  const radius = spinnerRadius(spinnerSizes[size]);
  const circumference = spinnerCircumference(radius);
  const sweep = spinnerSweep(progress);
  const isIndeterminate = progress === undefined;

  const isWhiteArc = color === SpinnerColor.primaryWhite;

  const spinnerColors: SpinnerColors = {
    arc: colors[color],
    track: isWhiteArc ? colors.primaryWhite : colors.tertiaryGrey,
    trackOpacity: isWhiteArc ? opacity.opacity20 : opacity.opacity100,
  };

  return {
    derived: {
      box,
      strokeWidth,
      center,
      radius,
      spinnerColors,
      isIndeterminate,
      dashArray: circumference,
      dashOffset: circumference - spinnerDashLength(radius, sweep),
      hasArc: sweep > NO_SWEEP,
      arcRotation: `rotate(${ARC_START_ANGLE} ${center} ${center})`,
      accessibilityBusy: isIndeterminate ? true : undefined,
      accessibilityValue: isIndeterminate
        ? undefined
        : { min: MIN_PERCENT, max: MAX_PERCENT, now: spinnerPercent(sweep) },
    },
  };
};
