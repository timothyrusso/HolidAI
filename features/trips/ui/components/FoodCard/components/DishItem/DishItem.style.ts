import { colors, fontFamily, images, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.Single,
  },
  image: {
    width: images.dishImageSize,
    height: images.dishImageSize,
    borderRadius: images.dishImageSize,
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
    textAlign: 'center',
  },
});
