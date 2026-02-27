import { colors } from '@/ui/style/colors';
import { images } from '@/ui/style/dimensions/images';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import type { Animated, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

export const style = (
  chipsAlignment: ViewStyle['justifyContent'],
  animatedHeaderHeight?: Animated.AnimatedInterpolation<string | number>,
  animatedOpacity?: Animated.AnimatedInterpolation<string | number>,
) =>
  StyleSheet.create({
    image: {
      width: '100%',
      height: images.fullScreenImageHeight,
      flex: 1,
    },
    header: {
      width: '100%',
      height: animatedHeaderHeight,
      position: 'absolute',
      top: 0,
      zIndex: 3,
    },
    iconsContainer: { zIndex: 2, width: '100%', position: 'absolute' },
    titleContainer: {
      position: 'absolute',
      bottom: spacing.Quintuple,
      paddingHorizontal: spacing.Fourfold,
      zIndex: 1,
      opacity: animatedOpacity,
    },
    title: {
      color: colors.primaryBlack,
      fontSize: spacing.Triple,
      fontFamily: fonts.interBold,
      backgroundColor: colors.primaryWhite,
      borderRadius: spacing.Fourfold,
      paddingVertical: spacing.Single,
      paddingHorizontal: spacing.Triple,
      textAlign: 'center',
      maxWidth: '80%',
    },
    chipsContainer: {
      flexDirection: 'row',
      gap: spacing.Single,
      width: '100%',
      justifyContent: chipsAlignment,
      alignItems: 'center',
    },
    detailsChipRow: {
      flexDirection: 'row',
      gap: spacing.Single,
    },
    budgetChipLabel: {
      color: colors.primaryBlack,
      fontSize: spacing.SingleAndHalf + spacing.Minimal,
      fontFamily: fonts.interBold,
      textAlign: 'center',
    },
    travelersChipLabel: {
      color: colors.primaryBlack,
      fontSize: spacing.SingleAndHalf + spacing.Minimal,
      fontFamily: fonts.interBold,
      textAlign: 'center',
    },
    dateChipLabel: {
      color: colors.primaryBlack,
      fontSize: spacing.SingleAndHalf + spacing.Minimal,
      fontFamily: fonts.interBold,
      textAlign: 'center',
    },
    detailsChip: {
      backgroundColor: colors.primaryBlue,
      borderRadius: spacing.Fourfold,
      flexDirection: 'row',
      gap: spacing.Single,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.Single,
      paddingHorizontal: spacing.Triple,
      height: spacing.Quintuple,
    },
    imageSkeleton: {
      width: '100%',
      height: images.fullScreenImageHeight,
      backgroundColor: colors.primaryGrey,
    },
  });
