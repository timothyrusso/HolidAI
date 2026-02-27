import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
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
      fontFamily: fonts.interBold,
      fontSize: spacing.Fourfold,
      color: labelColor,
    },
  });
