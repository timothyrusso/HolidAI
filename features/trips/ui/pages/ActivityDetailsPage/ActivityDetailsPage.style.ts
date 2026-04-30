import { colors } from '@/ui/style/colors';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { images } from '@/ui/style/dimensions/images';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
      fontSize: fontSize.LG,
      fontFamily: fontFamily.interMedium,
      color: colors.primaryBlack,
      paddingHorizontal: spacing.Fourfold,
      lineHeight: spacing.Fourfold,
    },
    insightsContainer: {
      paddingHorizontal: spacing.Fourfold,
      paddingVertical: spacing.Double,
      backgroundColor: colors.primaryYellow,
      marginTop: spacing.Double,
    },
    insightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.Single,
      paddingBottom: spacing.Single,
    },
    insightTitle: {
      fontSize: fontSize.LG,
      fontFamily: fontFamily.interBold,
      color: colors.primaryBlack,
    },
    insightDescription: {
      fontSize: fontSize.LG,
      fontFamily: fontFamily.interMedium,
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
