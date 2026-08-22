import { components } from '@/features/core/design-system/style/dimensions/components';
import { fontSize } from '@/features/core/design-system/style/dimensions/fontSize';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

/**
 * Per-size geometry of the tag, component-scoped on purpose: the letter-spacings 0.72/0.8/0.96 are asked for
 * only by the tag and the chip, and adding them to a shared ladder would offer every other component a step
 * it must never use. Unlike the chip's, the radius is flat at every size — a tag is a rounded rectangle,
 * never a pill — and the heights are the chip's tokens because the two components share one height scale, so
 * one set of tokens is correct even read from here.
 */
export const tagSizes = {
  small: {
    height: components.chipSmallHeight,
    radius: spacing.Single,
    paddingHorizontal: spacing.Double,
    iconSize: spacing.Double,
    gap: spacing.MinimalDouble,
    fontSize: fontSize.XXS,
    letterSpacing: 0.72,
  },
  medium: {
    height: components.chipMediumHeight,
    radius: spacing.Single,
    paddingHorizontal: spacing.Triple,
    iconSize: spacing.Triple,
    gap: spacing.Single,
    fontSize: fontSize.XS,
    letterSpacing: 0.8,
  },
  large: {
    height: components.chipLargeHeight,
    radius: spacing.Single,
    paddingHorizontal: spacing.Fourfold,
    iconSize: spacing.TripleAndHalf,
    gap: spacing.SingleAndHalf,
    fontSize: fontSize.SM,
    letterSpacing: 0.96,
  },
} as const;

export type TagSizeName = keyof typeof tagSizes;

export type TagSize = (typeof tagSizes)[TagSizeName];
