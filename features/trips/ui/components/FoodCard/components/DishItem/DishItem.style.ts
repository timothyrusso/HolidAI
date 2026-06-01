import { colors, fontFamily, images, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Double,
  },
  image: {
    width: images.dishImageSize,
    height: images.dishImageSize,
    borderRadius: images.dishImageSize,
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
});
