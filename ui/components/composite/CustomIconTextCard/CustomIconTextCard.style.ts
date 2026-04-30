import { components } from '@/ui/style/dimensions/components';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = (labelColor: TextStyle['color'], iconBackgroundColor: ViewStyle['backgroundColor']) =>
  StyleSheet.create({
    card: {
      height: components.textIconCard,
      justifyContent: 'space-between',
      padding: spacing.Triple,
    },
    icon: {
      alignSelf: 'flex-start',
      backgroundColor: iconBackgroundColor,
    },
    label: {
      fontFamily: fontFamily.interBold,
      fontSize: fontSize.XL2,
      color: labelColor,
    },
  });
