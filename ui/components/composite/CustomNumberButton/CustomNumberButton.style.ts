import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
      fontFamily: fontFamily.interBold,
      fontSize: spacing.Triple,
      color: labelColor,
    },
  });
