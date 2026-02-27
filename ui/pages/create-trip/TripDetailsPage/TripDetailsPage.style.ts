import { PlatformOS } from '@/ui/device/PlatformOS';
import { colors } from '@/ui/style/colors';
import { images } from '@/ui/style/dimensions/images';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  subTitle: {
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
    paddingHorizontal: spacing.Fourfold,
    color: colors.primaryGrey,
    textAlign: 'center',
  },
  basicViewContainer: {
    padding: 0,
    position: 'relative',
  },
  dayPlans: {
    paddingBottom:
      Platform.OS === PlatformOS.ios ? spacing.FourfoldAndHalf : images.fullScreenImageHeight + spacing.FourfoldAndHalf,
  },
  separator: {
    height: spacing.Triple,
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
