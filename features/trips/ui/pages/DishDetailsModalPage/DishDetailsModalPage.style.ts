import { colors, fontFamily, fontSize, images, shadows, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: spacing.Quintuple,
    paddingHorizontal: spacing.Quintuple,
  },
  container: {
    backgroundColor: colors.primaryWhite,
  },
  imageWrapper: {
    width: images.dishFullImageSize,
    height: images.dishFullImageSize,
    borderRadius: images.dishFullImageSize,
    boxShadow: shadows.highShadow,
  },
  image: {
    width: images.dishFullImageSize,
    height: images.dishFullImageSize,
    borderRadius: images.dishFullImageSize,
  },
  bodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: spacing.Fourfold,
  },
  description: {
    flex: 1,
    fontFamily: fontFamily.interRegular,
    fontSize: fontSize.MD,
  },
});
