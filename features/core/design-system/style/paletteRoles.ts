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

export const AccentHue = {
  Purple: 'purple',
  Lime: 'lime',
  Red: 'red',
  Cyan: 'cyan',
  Black: 'black',
} as const;

export type AccentHue = (typeof AccentHue)[keyof typeof AccentHue];

export type AccentShades = {
  fill: string;
  emphasis: string;
};

const accentShadePairs: Record<AccentHue, AccentShades> = {
  [AccentHue.Purple]: { fill: colors.purple500, emphasis: colors.purple900 },
  [AccentHue.Lime]: { fill: colors.lime500, emphasis: colors.lime900 },
  [AccentHue.Red]: { fill: colors.red500, emphasis: colors.red900 },
  [AccentHue.Cyan]: { fill: colors.cyan500, emphasis: colors.cyan900 },
  [AccentHue.Black]: { fill: colors.primaryBlack, emphasis: colors.primaryBlack },
};

/**
 * The two shades an accent resolves to: `<hue>500` fills, `<hue>900` emphasizes. Black has no lighter
 * shade to fill with, so it carries both roles.
 */
export const accentShades = (hue: AccentHue): AccentShades => accentShadePairs[hue];
