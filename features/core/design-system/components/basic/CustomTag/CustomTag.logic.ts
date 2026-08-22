import type { RefObject } from 'react';
import { Platform, type View } from 'react-native';

import type { IoniconsName } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { PlatformOS } from '@/features/core/design-system/PlatformOS';
import { blur } from '@/features/core/design-system/style/blur';
import { colors } from '@/features/core/design-system/style/colors';
import { type TagSize, type TagSizeName, tagSizes } from '@/features/core/design-system/style/dimensions/tag';
import {
  type PaletteBackgroundColor,
  type PaletteColor,
  paletteContentColor,
} from '@/features/core/design-system/style/paletteRoles';

export type TagColor = PaletteBackgroundColor;

export const TagVariant = {
  Solid: 'solid',
  Blur: 'blur',
} as const;

export type TagVariant = (typeof TagVariant)[keyof typeof TagVariant];

const DEFAULT_TAG_SIZE: TagSizeName = 'medium';

// Exhaustive on purpose: a colour added to the palette without a border decision fails to compile
// here rather than rendering a tag with no outline at all.
const tagBorderColors: Record<TagColor, PaletteColor> = {
  [colors.purple300]: colors.purple500,
  [colors.purple500]: colors.purple700,
  [colors.purple700]: colors.purple900,
  [colors.purple900]: colors.purple1100,
  [colors.lime300]: colors.lime500,
  [colors.lime500]: colors.lime700,
  [colors.lime700]: colors.lime900,
  [colors.lime900]: colors.lime1100,
  [colors.red300]: colors.red500,
  [colors.red500]: colors.red700,
  [colors.red700]: colors.red900,
  [colors.red900]: colors.red1100,
  [colors.cyan300]: colors.cyan500,
  [colors.cyan500]: colors.cyan700,
  [colors.cyan700]: colors.cyan900,
  [colors.cyan900]: colors.cyan1100,
  // The neutrals have no family to darken into, so they borrow the grey that reads on all of them.
  [colors.primaryWhite]: colors.primaryGrey,
  [colors.primaryWhiteDisabled]: colors.primaryGrey,
  [colors.secondaryGrey]: colors.primaryGrey,
  [colors.tertiaryGrey]: colors.primaryGrey,
  [colors.primaryGrey]: colors.primaryGreyDark,
  [colors.primaryBlack]: colors.primaryGrey,
};

/** The outline a background carries — one shade darker in its own family, derived, never passed. */
const tagBorderColor = (backgroundColor: TagColor): PaletteColor => tagBorderColors[backgroundColor];

/** Icon-only tags are square, so the icon sits in symmetric padding rather than the side padding. */
export const tagIconOnlyPadding = ({ height, iconSize }: TagSize) => (height - iconSize) / 2;

type TagBaseProps = {
  size?: TagSizeName;
  /** Renders the label in upper case, as the design specifies for every tag that is not free text. */
  uppercase?: boolean;
};

type TagLabelledProps = {
  title: string;
  icon?: IoniconsName;
  accessibilityLabel?: string;
};

type TagIconOnlyProps = {
  title?: never;
  icon: IoniconsName;
  /** Required: an icon-only tag has no visible text for a screen reader to announce. */
  accessibilityLabel: string;
};

type TagContentProps = TagLabelledProps | TagIconOnlyProps;

type TagSolidProps = {
  variant?: typeof TagVariant.Solid;
  color: TagColor;
  blurTargetRef?: never;
};

type TagBlurProps = {
  variant: typeof TagVariant.Blur;
  /** The blur tag owns its fill, so a background colour is not the caller's to choose. */
  color?: never;
  /**
   * The `BlurTargetView` ancestor whose pixels Android should blur — plumb it from the screen that
   * owns the background. Ignored on iOS, which blurs whatever is behind the view.
   */
  blurTargetRef?: RefObject<View | null>;
};

export type CustomTagProps =
  | (TagBaseProps & TagContentProps & TagSolidProps)
  | (TagBaseProps & TagContentProps & TagBlurProps);

export type TagColors = {
  background?: TagColor;
  content: TagColor;
  /** Absent on the blur tag, whose white hairline is an overlay rather than a container border. */
  border?: PaletteColor;
};

export const useCustomTagLogic = (props: CustomTagProps) => {
  const tagSize = tagSizes[props.size ?? DEFAULT_TAG_SIZE];

  const isBlur = props.variant === TagVariant.Blur;

  // `expo-blur` can only sample the pixels behind it on Android when it is handed a `blurTarget`
  // ancestor, which a reusable tag cannot own: without one from the screen, there is no blur to
  // render at all.
  const canBlur = Platform.OS !== PlatformOS.android || props.blurTargetRef !== undefined;

  const tagColors: TagColors = isBlur
    ? { content: colors.primaryWhite }
    : {
        background: props.color,
        content: paletteContentColor(props.color),
        border: tagBorderColor(props.color),
      };

  return {
    derived: {
      tagSize,
      tagColors,
      isBlur,
      canBlur,
      isIconOnly: props.title === undefined,
      // Beside a label the icon only restates it, so a screen reader must not stop on it twice.
      isIconDecorative: props.title !== undefined,
      // An icon-only tag is a single element or a screen reader finds nothing to announce; a
      // labelled tag only becomes one when the caller replaces its text with a label.
      isAccessibilityElement: props.title === undefined || props.accessibilityLabel !== undefined,
      intensity: blur.intensity30,
    },
  };
};
