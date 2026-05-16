import { components } from '@/features/core/ui/style/dimensions/components';
import { fontSize } from '@/features/core/ui/style/dimensions/fontSize';
import { fontFamily } from '@/features/core/ui/style/fontFamily';
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
      fontSize: fontSize.LG,
      color: labelColor,
    },
  });
