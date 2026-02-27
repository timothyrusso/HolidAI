import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = (height: number) =>
  StyleSheet.create({
    maskedView: {
      flexDirection: 'row',
      height,
      justifyContent: 'center',
    },
    maskElement: {
      backgroundColor: 'transparent',
      width: '100%',
      height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontFamily: fonts.interBold,
      fontSize: spacing.Triple + spacing.Minimal,
      textAlign: 'center',
      width: '100%',
      paddingHorizontal: spacing.Quintuple,
      lineHeight: spacing.Quintuple,
    },
    image: {
      flex: 1,
      width: '100%',
      height,
    },
  });
