import { colors, fontFamily, fontSize, images, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: spacing.Quintuple,
    paddingHorizontal: spacing.Quintuple,
  },
  container: {
    backgroundColor: colors.primaryWhite,
  },
  image: {
    width: images.dishFullImageSize,
    height: images.dishFullImageSize,
    borderRadius: images.dishFullImageSize,
    borderWidth: spacing.MinimalDouble,
    borderColor: colors.primaryBlack,
  },
  bodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: spacing.Double,
    marginBottom: spacing.Triple,
  },
  description: {
    flex: 1,
    fontFamily: fontFamily.interRegular,
    fontSize: fontSize.MD,
  },
});
