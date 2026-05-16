import { PlatformOS, colors, fontFamily, fontSize, images, spacing } from '@/features/core/ui';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  subTitle: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interMedium,
    paddingHorizontal: spacing.Fourfold,
    color: colors.primaryGrey,
    textAlign: 'center',
  },
  basicViewContainer: {
    padding: spacing.Zero,
    position: 'relative',
  },
  dayPlans: {
    paddingBottom:
      Platform.OS === PlatformOS.ios ? spacing.FourfoldAndHalf : images.fullScreenImageHeight + spacing.FourfoldAndHalf,
  },
  separator: {
    height: spacing.separator40,
    backgroundColor: colors.primary,
    zIndex: 2,
    width: spacing.MinimalDouble,
    alignSelf: 'center',
  },
  sectionList: {
    paddingTop: images.fullScreenImageHeight,
    backgroundColor: colors.primaryWhite,
    zIndex: 2,
    borderRadius: spacing.Triple,
    marginTop: spacing.Fourfold,
    flex: 1,
    width: '100%',
  },
});
