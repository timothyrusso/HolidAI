import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/features/core/design-system/style/colors';
import { fontSize } from '@/features/core/design-system/style/dimensions/fontSize';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { fontFamily } from '@/features/core/design-system/style/fontFamily';

const meta = {
  title: 'Design System/Colors',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** The board's row order. A ramp with no tokens yet simply renders no row. */
const RAMPS = ['purple', 'lime', 'red', 'cyan'] as const;

/**
 * The step is matched as `\d+`, not as a fixed list of steps: adding a `purple100` to `colors.ts`
 * must land it in the purple row, sorted, with no edit to this file. Anything that doesn't match a
 * ramp at all — the neutrals — falls into the last row.
 */
const RAMP_TOKEN = /^(purple|lime|red|cyan)(\d+)$/;

type Swatch = { token: string; hex: string };

const swatches: Swatch[] = Object.entries(colors).map(([token, hex]) => ({ token, hex }));

const rampOf = (token: string) => RAMP_TOKEN.exec(token)?.[1];
const stepOf = (token: string) => Number(RAMP_TOKEN.exec(token)?.[2] ?? 0);

const rows = [
  ...RAMPS.map(ramp => ({
    title: ramp,
    swatches: swatches.filter(({ token }) => rampOf(token) === ramp).sort((a, b) => stepOf(a.token) - stepOf(b.token)),
  })),
  { title: 'neutrals', swatches: swatches.filter(({ token }) => rampOf(token) === undefined) },
].filter(row => row.swatches.length > 0);

const SAMPLE_TEXT = 'Aa';

/**
 * The legibility strip is the point of a swatch: the palette's light steps cannot carry white
 * content and its dark steps cannot carry black, so every swatch shows the same sample in both and
 * the reader picks rather than guesses.
 *
 * Every label is raw `Text`, not `CustomText`: `CustomText` pipes every string through `t()` with no
 * escape hatch, and token names and hex codes are identifiers, not copy — they would emit
 * missing-key warnings, or silently display a translation on any key collision.
 */
function SwatchCell({ token, hex }: Swatch) {
  return (
    <View style={styles.cell}>
      <View style={[styles.chip, { backgroundColor: hex }]}>
        <Text style={styles.sampleBlack}>{SAMPLE_TEXT}</Text>
        <Text style={styles.sampleWhite}>{SAMPLE_TEXT}</Text>
      </View>
      <Text style={styles.token}>{token}</Text>
      <Text style={styles.hex}>{hex}</Text>
    </View>
  );
}

export const Palette: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.palette}>
      {rows.map(row => (
        <View key={row.title} style={styles.row}>
          <Text style={styles.rowTitle}>{row.title}</Text>
          <View style={styles.rowSwatches}>
            {row.swatches.map(swatch => (
              <SwatchCell key={swatch.token} {...swatch} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  ),
};

/**
 * A ratio, not a fixed width: four swatches fit one row inside the 360px phone frame from
 * `.storybook/preview.tsx` without pinning the story to that number, and any longer row wraps
 * instead of overflowing.
 */
const CELL_WIDTH = '25%';

const styles = StyleSheet.create({
  palette: {
    gap: spacing.Triple,
  },
  row: {
    gap: spacing.Single,
  },
  rowTitle: {
    color: colors.primaryBlack,
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.SM,
    textTransform: 'uppercase',
  },
  rowSwatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    gap: spacing.HalfMinimal,
    paddingBottom: spacing.Double,
    paddingRight: spacing.Single,
    width: CELL_WIDTH,
  },
  chip: {
    alignItems: 'center',
    borderColor: colors.secondaryGrey,
    borderRadius: spacing.Single,
    borderWidth: 1,
    gap: spacing.HalfMinimal,
    justifyContent: 'center',
    paddingVertical: spacing.Single,
  },
  sampleBlack: {
    color: colors.primaryBlack,
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.XS,
  },
  sampleWhite: {
    color: colors.primaryWhite,
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.XS,
  },
  token: {
    color: colors.primaryBlack,
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.XXS,
  },
  hex: {
    color: colors.primaryGrey,
    fontFamily: fontFamily.interRegular,
    fontSize: fontSize.XXS,
  },
});
