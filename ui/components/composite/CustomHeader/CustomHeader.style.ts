import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const style = (headerPaddingTop: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: headerPaddingTop,
      backgroundColor: colors.primaryWhite,
      paddingBottom: spacing.Double,
    },
    title: {
      fontSize: spacing.Fourfold,
      fontFamily: fonts.interBold,
      textAlign: 'center',
      width: '100%',
    },
    icon: {
      position: 'absolute',
      left: spacing.Fourfold,
      top: headerPaddingTop,
      zIndex: 1,
    },
  });
