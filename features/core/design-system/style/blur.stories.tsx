import type { Meta, StoryObj } from '@storybook/react-native';
import { BlurTargetView, BlurView } from 'expo-blur';
import { type RefObject, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { blur } from '@/features/core/design-system/style/blur';
import { colors } from '@/features/core/design-system/style/colors';
import { fontSize } from '@/features/core/design-system/style/dimensions/fontSize';
import { SCREEN_WIDTH, spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { fontFamily } from '@/features/core/design-system/style/fontFamily';

/**
 * `expo-blur` intensity is a 0–100 scale, not a pixel radius.
 *
 * Read the ramp on iOS: that is the platform the scale is tuned for. On web `BlurView` falls back to
 * the CSS `backdrop-filter`, whose radius is `intensity * 0.2` pixels and spreads differently. On
 * Android the blur comes from `dimezisBlurView`, which divides the intensity by
 * `blurReductionFactor` (4 by default), so the same token reads softer than on iOS.
 */
const meta = {
  title: 'Design System/Blur',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * `DEFAULT_BLURHASH` lives in `blur.ts` too but is an image placeholder, not an intensity: it is a
 * separate export, so deriving the scale from the `blur` object leaves it out by construction.
 */
const samples = Object.entries(blur).map(([token, intensity]) => ({ token, intensity }));

/**
 * A blur is only visible over detail. The backdrop is built from `View`s and palette tokens rather
 * than an image so the story stays asset-free, and it carries text because glyph edges are the
 * highest-frequency content available — the first thing a low intensity smears.
 */
const PATTERN_COLORS = [
  colors.purple500,
  colors.lime500,
  colors.red500,
  colors.cyan500,
  colors.purple300,
  colors.lime300,
  colors.red300,
  colors.cyan300,
] as const;

const PATTERN_BLOCK_SIZE = 28;

const CANVAS_HEIGHT = 84;

/**
 * Sized off the device width rather than the canvas, whose width is only known at layout time: the
 * surplus blocks wrap past the canvas and are clipped by its `overflow: 'hidden'`.
 */
const PATTERN_BLOCK_COUNT =
  Math.ceil(SCREEN_WIDTH / PATTERN_BLOCK_SIZE) * Math.ceil(CANVAS_HEIGHT / PATTERN_BLOCK_SIZE);

const PATTERN_TEXT = 'Aa';

const PATTERN_BLOCKS = Array.from({ length: PATTERN_BLOCK_COUNT }, (_, index) => ({
  id: `block-${index}`,
  color: PATTERN_COLORS[index % PATTERN_COLORS.length],
}));

type PatternBackdropProps = { blurTargetRef: RefObject<View | null> };

function PatternBackdrop({ blurTargetRef }: PatternBackdropProps) {
  return (
    <BlurTargetView ref={blurTargetRef} style={styles.pattern}>
      {PATTERN_BLOCKS.map(block => (
        <View key={block.id} style={[styles.patternBlock, { backgroundColor: block.color }]}>
          <Text style={styles.patternText}>{PATTERN_TEXT}</Text>
        </View>
      ))}
    </BlurTargetView>
  );
}

type Sample = { token: string; intensity: number };

/** The blur covers only part of the sample, so every row also shows the crisp backdrop to judge it against. */
function BlurSample({ token, intensity }: Sample) {
  const blurTargetRef = useRef<View | null>(null);

  return (
    <View style={styles.sample}>
      <View style={styles.canvas}>
        <PatternBackdrop blurTargetRef={blurTargetRef} />
        <BlurView
          intensity={intensity}
          style={styles.blurOverlay}
          blurMethod="dimezisBlurView"
          blurTarget={blurTargetRef}
          tint="dark"
        />
      </View>
      <View style={styles.labels}>
        <Text style={styles.token}>{token}</Text>
        <Text style={styles.value}>{intensity}</Text>
      </View>
    </View>
  );
}

export const Scale: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.scale}>
      {samples.map(sample => (
        <BlurSample key={sample.token} {...sample} />
      ))}
    </ScrollView>
  ),
};

/** Where the blur starts, leaving the left third of the backdrop untouched as the reference. */
const BLUR_OVERLAY_LEFT = '35%';

const styles = StyleSheet.create({
  scale: {
    gap: spacing.Triple,
  },
  sample: {
    gap: spacing.Single,
  },
  canvas: {
    borderRadius: spacing.SingleAndHalf,
    height: CANVAS_HEIGHT,
    overflow: 'hidden',
  },
  pattern: {
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  patternBlock: {
    alignItems: 'center',
    height: PATTERN_BLOCK_SIZE,
    justifyContent: 'center',
    width: PATTERN_BLOCK_SIZE,
  },
  patternText: {
    color: colors.primaryBlack,
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.XS,
  },
  blurOverlay: {
    bottom: 0,
    left: BLUR_OVERLAY_LEFT,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  labels: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing.Single,
  },
  token: {
    color: colors.primaryBlack,
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.SM,
  },
  value: {
    color: colors.primaryGrey,
    fontFamily: fontFamily.interRegular,
    fontSize: fontSize.XXS,
  },
});
