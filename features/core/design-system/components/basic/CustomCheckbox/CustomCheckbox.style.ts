import { StyleSheet } from 'react-native';

import { colors } from '@/features/core/design-system/style/colors';

type CustomCheckboxStyleParams = {
  box: number;
  strokeWidth: number;
  touchPadding: number;
};

export const customCheckboxStyles = ({ box, strokeWidth, touchPadding }: CustomCheckboxStyleParams) =>
  StyleSheet.create({
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
