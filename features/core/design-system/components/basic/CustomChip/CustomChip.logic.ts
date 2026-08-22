import type { RefObject } from 'react';
import { Platform, type StyleProp, type View, type ViewStyle } from 'react-native';

import type { IoniconsName } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { PlatformOS } from '@/features/core/design-system/PlatformOS';
import { blur } from '@/features/core/design-system/style/blur';
import { colors } from '@/features/core/design-system/style/colors';
import { type ChipSize, type ChipSizeName, chipSizes } from '@/features/core/design-system/style/dimensions/chip';
import { type PaletteBackgroundColor, paletteContentColor } from '@/features/core/design-system/style/paletteRoles';

export type ChipColor = PaletteBackgroundColor;

export const ChipVariant = {
  Solid: 'solid',
  Blur: 'blur',
} as const;

export type ChipVariant = (typeof ChipVariant)[keyof typeof ChipVariant];

const DEFAULT_CHIP_SIZE: ChipSizeName = 'medium';

/** Icon-only chips are square, so the icon sits in symmetric padding rather than the side padding. */
export const chipIconOnlyPadding = ({ height, iconSize }: ChipSize) => (height - iconSize) / 2;

type ChipBaseProps = {
  size?: ChipSizeName;
  /** Renders the label in upper case, as the design specifies for every chip that is not free text. */
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
};

type ChipLabelledProps = {
  title: string;
  icon?: IoniconsName;
  accessibilityLabel?: string;
};

type ChipIconOnlyProps = {
  title?: never;
  icon: IoniconsName;
  /** Required: an icon-only chip has no visible text for a screen reader to announce. */
  accessibilityLabel: string;
};

type ChipContentProps = ChipLabelledProps | ChipIconOnlyProps;

type ChipSolidProps = {
  variant?: typeof ChipVariant.Solid;
  color: ChipColor;
  blurTargetRef?: never;
};

type ChipBlurProps = {
  variant: typeof ChipVariant.Blur;
  /** The blur chip owns its fill, so a background colour is not the caller's to choose. */
  color?: never;
  /**
   * The `BlurTargetView` ancestor whose pixels Android should blur — plumb it from the screen that
   * owns the background. Ignored on iOS, which blurs whatever is behind the view.
   */
  blurTargetRef?: RefObject<View | null>;
};

export type CustomChipProps =
  | (ChipBaseProps & ChipContentProps & ChipSolidProps)
  | (ChipBaseProps & ChipContentProps & ChipBlurProps);

export type ChipColors = {
  background?: ChipColor;
  content: ChipColor;
};

export const useCustomChipLogic = (props: CustomChipProps) => {
  const chipSize = chipSizes[props.size ?? DEFAULT_CHIP_SIZE];

  const isBlur = props.variant === ChipVariant.Blur;

  // `expo-blur` can only sample the pixels behind it on Android when it is handed a `blurTarget`
  // ancestor, which a reusable chip cannot own: without one from the screen, there is no blur to
  // render at all.
  const canBlur = Platform.OS !== PlatformOS.android || props.blurTargetRef !== undefined;

  const chipColors: ChipColors = isBlur
    ? { content: colors.primaryWhite }
    : { background: props.color, content: paletteContentColor(props.color) };

  return {
    derived: {
      chipSize,
      chipColors,
      isBlur,
      canBlur,
      isIconOnly: props.title === undefined,
      // Beside a label the icon only restates it, so a screen reader must not stop on it twice.
      isIconDecorative: props.title !== undefined,
      // An icon-only chip is a single element or a screen reader finds nothing to announce; a
      // labelled chip only becomes one when the caller replaces its text with a label.
      isAccessibilityElement: props.title === undefined || props.accessibilityLabel !== undefined,
      intensity: blur.intensity30,
    },
  };
};
