import { SCREEN_WIDTH, colors, fontFamily, images, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

const ITEM_WIDTH = (SCREEN_WIDTH - spacing.Quintuple * 4) / 2;

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.Single,
    width: ITEM_WIDTH,
  },
  image: {
    width: images.dishImageSize,
    height: images.dishImageSize,
    borderRadius: spacing.Double,
  },
  skeleton: {
    width: images.dishImageSize,
    height: images.dishImageSize,
    borderRadius: spacing.Double,
  },
  label: {
    fontFamily: fontFamily.interBold,
    color: colors.primaryBlack,
    backgroundColor: colors.primaryGreen,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    borderRadius: spacing.SingleAndHalf,
    paddingHorizontal: spacing.Single,
    paddingVertical: spacing.Minimal,
    width: ITEM_WIDTH,
    textAlign: 'center',
  },
});
