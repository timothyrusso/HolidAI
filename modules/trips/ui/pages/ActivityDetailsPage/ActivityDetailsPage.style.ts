import { colors } from '@/ui/style/colors';
import { images } from '@/ui/style/dimensions/images';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = (isImageLoading: boolean) =>
  StyleSheet.create({
    basicViewContainer: {
      padding: 0,
      position: 'relative',
      flex: 1,
    },
    container: {
      flex: 1,
      width: '100%',
      paddingTop: isImageLoading ? 0 : images.fullScreenImageHeight,
    },
    scrollView: {
      flex: 1,
      width: '100%',
    },
    description: {
      fontSize: spacing.Triple,
      fontFamily: fonts.interMedium,
      color: colors.primaryBlack,
      paddingHorizontal: spacing.Fourfold,
      lineHeight: spacing.Fourfold,
    },
    insightsContainer: {
      paddingHorizontal: spacing.Fourfold,
      backgroundColor: colors.primaryYellow,
      padding: spacing.Double,
      marginTop: spacing.Double,
    },
    insightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.Single,
      paddingBottom: spacing.Single,
    },
    insightTitle: {
      fontSize: spacing.Triple,
      fontFamily: fonts.interBold,
      color: colors.primaryBlack,
    },
    insightDescription: {
      fontSize: spacing.Triple,
      fontFamily: fonts.interMedium,
      color: colors.primaryBlack,
      lineHeight: spacing.Fourfold,
    },
    backIcon: {
      position: 'absolute',
      zIndex: spacing.Double,
      left: spacing.Fourfold,
      top: spacing.TripleAndHalf + spacing.separator40,
    },
  });
