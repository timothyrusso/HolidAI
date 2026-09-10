import { StyleSheet } from 'react-native';

import { colors } from '@/features/core/design-system/style/colors';

type CustomCheckboxStyleParams = {
  box: number;
  strokeWidth: number;
  touchPadding: number;
};

export const customCheckboxStyles = ({ box, strokeWidth, touchPadding }: CustomCheckboxStyleParams) =>
  StyleSheet.create({
    // The pressable's own box carries the touch target, grown by `touchPadding` and pulled back
    // out of the layout with a negative margin: react-native-web ignores `hitSlop`, so a medium
    // checkbox is only tappable past its edge if the element itself is the bigger one.
    container: {
      width: box + touchPadding * 2,
      height: box + touchPadding * 2,
      margin: -touchPadding,
      alignItems: 'center',
      justifyContent: 'center',
    },
    box: {
      width: box,
      height: box,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Lifted out of the flow so the glyph centres on the box rather than sitting beside the ring.
    ring: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: box / 2,
    },
    outline: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: box / 2,
      borderWidth: strokeWidth,
      borderColor: colors.tertiaryGrey,
    },
  });
