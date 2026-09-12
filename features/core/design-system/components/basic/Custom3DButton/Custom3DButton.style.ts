import { StyleSheet } from 'react-native';

import type { Custom3DButtonColors } from '@/features/core/design-system/components/basic/Custom3DButton/Custom3DButton.logic';
import { colors } from '@/features/core/design-system/style/colors';
import type { RaisedButtonSize } from '@/features/core/design-system/style/dimensions/raisedButton';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { fontFamily } from '@/features/core/design-system/style/fontFamily';

type Custom3DButtonStyleParams = {
  size: RaisedButtonSize;
  buttonColors: Custom3DButtonColors;
};

export const custom3DButtonStyles = ({ size, buttonColors }: Custom3DButtonStyleParams) => {
  const faceHeight = size.height - size.raiseLevel;

  return StyleSheet.create({
    container: {
      width: '100%',
      height: size.height,
    },
    bottomFace: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: faceHeight,
      borderRadius: size.radius,
      backgroundColor: buttonColors.raisedColor,
    },
    content: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: faceHeight,
    },
    topFace: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: size.radius,
      borderWidth: spacing.Minimal,
      borderColor: buttonColors.borderColor,
      backgroundColor: buttonColors.faceColor,
    },
    pressOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.primaryBlack,
    },
    text: {
      flexShrink: 1,
      color: buttonColors.contentColor,
      fontSize: size.fontSize,
      fontFamily: fontFamily.interBold,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    leftIcon: {
      marginRight: spacing.Single,
    },
    rightIcon: {
      marginLeft: spacing.Single,
    },
  });
};
