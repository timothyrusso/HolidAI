import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet, type TextStyle } from 'react-native';

export const styles = (labelColor: TextStyle['color']) =>
  StyleSheet.create({
    card: {
      height: components.buttonNumberHeight,
      width: components.buttonNumberHeight,
      justifyContent: 'center',
      alignItems: 'center',
    },

    label: {
      fontFamily: fonts.interBold,
      fontSize: spacing.Triple,
      color: labelColor,
    },
  });
