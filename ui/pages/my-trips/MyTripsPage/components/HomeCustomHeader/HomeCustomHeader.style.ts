import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { opacity } from '@/ui/style/opacity';
import { StyleSheet } from 'react-native';

export const styles = (top: number) =>
  StyleSheet.create({
    container: {
      top: top,
      right: spacing.Fourfold,
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      zIndex: 2,
    },
    showAllTripsContainer: {
      paddingHorizontal: spacing.SingleAndHalf,
      paddingVertical: spacing.Single,
      borderRadius: spacing.Fourfold,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.Single,
    },
    showAllTripsText: {
      color: colors.primaryWhite,
      fontFamily: fonts.interBold,
      fontSize: spacing.Double,
    },
    pressed: {
      opacity: opacity.default,
    },
  });
