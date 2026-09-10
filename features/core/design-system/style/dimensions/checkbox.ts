import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

export const checkboxSizes = {
  medium: {
    box: spacing.separator40,
    glyph: spacing.TripleAndHalf,
    strokeWidth: spacing.Minimal,
    touchPadding: spacing.MinimalDouble,
  },
  large: {
    box: spacing.Sextuple,
    glyph: spacing.Fourfold,
    strokeWidth: spacing.Minimal,
    touchPadding: spacing.Zero,
  },
} as const;

export type CheckboxSizeName = keyof typeof checkboxSizes;

export type CheckboxSize = (typeof checkboxSizes)[CheckboxSizeName];
