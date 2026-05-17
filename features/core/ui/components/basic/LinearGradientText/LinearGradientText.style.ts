import { fontSize } from '@/features/core/ui/style/dimensions/fontSize';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { fontFamily } from '@/features/core/ui/style/fontFamily';
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
      fontFamily: fontFamily.interBold,
      fontSize: fontSize.XL,
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
