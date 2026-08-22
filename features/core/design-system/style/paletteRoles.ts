import { colors } from '@/features/core/design-system/style/colors';

export type PaletteColor = (typeof colors)[keyof typeof colors];

/**
 * The darker shades exist to draw a border against their own family and are unreadable as a
 * surface, so they are excluded from every background union and never need a contrast decision.
 */
type BorderOnlyColor =
  | typeof colors.purple1100
  | typeof colors.lime1100
  | typeof colors.red1100
  | typeof colors.cyan1100
  | typeof colors.primaryGreyDark;

/** The colours a chip or a tag may take as its fill: the palette minus the border-only shades. */
export type PaletteBackgroundColor = Exclude<PaletteColor, BorderOnlyColor>;

// Exhaustive on purpose: a colour added to the palette without a contrast decision fails to compile
// here, instead of silently inheriting a black label a future dark shade could never carry.
const paletteContentColors: Record<PaletteBackgroundColor, PaletteBackgroundColor> = {
  [colors.purple300]: colors.primaryBlack,
  [colors.purple500]: colors.primaryWhite,
  [colors.purple700]: colors.primaryWhite,
  [colors.purple900]: colors.primaryWhite,
  [colors.lime300]: colors.primaryBlack,
  [colors.lime500]: colors.primaryBlack,
  [colors.lime700]: colors.primaryBlack,
  [colors.lime900]: colors.primaryBlack,
  [colors.red300]: colors.primaryBlack,
  [colors.red500]: colors.primaryWhite,
  [colors.red700]: colors.primaryWhite,
  [colors.red900]: colors.primaryWhite,
  [colors.cyan300]: colors.primaryBlack,
  [colors.cyan500]: colors.primaryBlack,
  [colors.cyan700]: colors.primaryBlack,
  [colors.cyan900]: colors.primaryWhite,
  [colors.primaryWhite]: colors.primaryBlack,
  [colors.primaryWhiteDisabled]: colors.primaryBlack,
  [colors.secondaryGrey]: colors.primaryBlack,
  [colors.tertiaryGrey]: colors.primaryBlack,
  [colors.primaryGrey]: colors.primaryBlack,
  [colors.primaryBlack]: colors.primaryWhite,
};

/** The label and icon colour a background carries — derived here so no caller can break contrast. */
export const paletteContentColor = (backgroundColor: PaletteBackgroundColor): PaletteBackgroundColor =>
  paletteContentColors[backgroundColor];

/** Narrows a palette token to the fills a chip or a tag may take, excluding the border-only shades. */
export const isPaletteBackgroundColor = (color: PaletteColor): color is PaletteBackgroundColor =>
  color in paletteContentColors;
