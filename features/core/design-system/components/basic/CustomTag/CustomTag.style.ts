import { StyleSheet } from 'react-native';

import {
  type TagColors,
  tagIconOnlyPadding,
} from '@/features/core/design-system/components/basic/CustomTag/CustomTag.logic';
import { colors } from '@/features/core/design-system/style/colors';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import type { TagSize } from '@/features/core/design-system/style/dimensions/tag';
import { fontFamily } from '@/features/core/design-system/style/fontFamily';
import { opacity } from '@/features/core/design-system/style/opacity';

type TagStyleParams = {
  tagSize: TagSize;
  tagColors: TagColors;
  isIconOnly: boolean;
};

export const styleTag = ({ tagSize, tagColors, isIconOnly }: TagStyleParams) => {
  const iconOnlyPadding = tagIconOnlyPadding(tagSize);

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      justifyContent: 'center',
      gap: tagSize.gap,
      height: tagSize.height,
      width: isIconOnly ? tagSize.height : undefined,
      // The tag hugs its label, so only a cap against the parent lets an over-long one truncate
      // instead of overflowing.
      maxWidth: '100%',
      paddingHorizontal: isIconOnly ? iconOnlyPadding : tagSize.paddingHorizontal,
      borderRadius: tagSize.radius,
      backgroundColor: tagColors.background,
      overflow: 'hidden',
    },
    surface: {
      position: 'absolute',
      top: spacing.Zero,
      left: spacing.Zero,
      right: spacing.Zero,
      bottom: spacing.Zero,
    },
    mask: {
      flex: 1,
      borderRadius: tagSize.radius,
      backgroundColor: colors.primaryBlack,
    },
    tint: {
      flex: 1,
      backgroundColor: colors.primaryBlack,
      opacity: opacity.opacity25,
    },
    solidBorder: {
      position: 'absolute',
      top: spacing.Zero,
      left: spacing.Zero,
      right: spacing.Zero,
      bottom: spacing.Zero,
      borderWidth: spacing.HalfMinimal,
      borderColor: tagColors.border,
      borderRadius: tagSize.radius,
    },
    blurBorder: {
      position: 'absolute',
      top: spacing.Zero,
      left: spacing.Zero,
      right: spacing.Zero,
      bottom: spacing.Zero,
      borderWidth: spacing.HalfMinimal,
      borderColor: colors.primaryWhite,
      borderRadius: tagSize.radius,
      opacity: opacity.opacity50,
    },
    title: {
      flexShrink: 1,
      // A one-line label renders `nowrap` on web, which floors its min width at the full label and
      // overflows the capped tag instead of truncating. Already the Yoga default.
      minWidth: spacing.Zero,
      color: tagColors.content,
      fontFamily: fontFamily.interBold,
      fontSize: tagSize.fontSize,
      letterSpacing: tagSize.letterSpacing,
      textAlign: 'center',
    },
    titleUppercase: {
      textTransform: 'uppercase',
    },
  });
};
