import { StyleSheet } from 'react-native';
import { colors, fontFamily, images, opacity, spacing } from '@/features/core/ui';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Double,
    backgroundColor: colors.secondaryGrey,
    padding: spacing.Double,
    borderRadius: spacing.Fourfold,
  },
  image: {
    width: images.dishImageSize,
    height: images.dishImageSize,
    borderRadius: images.dishImageSize,
    borderWidth: spacing.Minimal,
    borderColor: colors.primaryBlack,
  },
  skeleton: {
    width: images.dishImageSize,
    height: images.dishImageSize,
    borderRadius: images.dishImageSize,
  },
  title: {
    fontFamily: fontFamily.interMedium,
    color: colors.primaryBlack,
    paddingVertical: spacing.Minimal,
  },
  description: {
    fontFamily: fontFamily.interRegular,
    color: colors.primaryGrey,
    paddingBottom: spacing.Single,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  pressed: {
    opacity: opacity.opacity60,
  },
  badge: {
    width: spacing.FourfoldAndHalf,
    height: spacing.FourfoldAndHalf,
  },
  badgeContainer: {
    flexDirection: 'row',
    columnGap: spacing.Minimal,
    left: -spacing.MinimalDouble,
  },
});
