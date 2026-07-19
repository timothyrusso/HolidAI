import { type DimensionValue, StyleSheet } from 'react-native';

import { spacing } from '@/features/core/ui/style/dimensions/spacing';

const DISABLED_OPACITY = 0.5;
const FULL_OPACITY = 1;
const SHADOW_HORIZONTAL_INSET: DimensionValue = '1%';
const HALF = 2;

type Custom3DButtonStyleParams = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  raisedColor: string;
  shadowColor: string;
  raiseLevel: number;
  height: number;
  width: number | undefined;
  stretch: boolean;
  textColor: string;
  textSize: number;
  textFontFamily: string;
  isDisabled: boolean;
};

export const custom3DButtonStyles = ({
  backgroundColor,
  borderColor,
  borderWidth,
  borderRadius,
  raisedColor,
  shadowColor,
  raiseLevel,
  height,
  width,
  stretch,
  textColor,
  textSize,
  textFontFamily,
  isDisabled,
}: Custom3DButtonStyleParams) => {
  // The two faces (top + raised bottom) are `raiseLevel` shorter than the container.
  // At rest the top face sits at the top, revealing a `raiseLevel`-tall strip of the raised
  // bottom face below it. On press the top face translates down by `raiseLevel` to cover it.
  const faceHeight = height - raiseLevel;
  const containerWidth: DimensionValue | undefined = width ?? (stretch ? '100%' : undefined);

  return StyleSheet.create({
    container: {
      height,
      width: containerWidth,
      opacity: isDisabled ? DISABLED_OPACITY : FULL_OPACITY,
    },
    shadow: {
      position: 'absolute',
      left: SHADOW_HORIZONTAL_INSET,
      right: SHADOW_HORIZONTAL_INSET,
      bottom: -raiseLevel / HALF,
      height: faceHeight,
      borderRadius,
      backgroundColor: shadowColor,
    },
    bottomFace: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: faceHeight,
      borderRadius,
      backgroundColor: raisedColor,
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
      borderRadius,
      borderWidth,
      borderColor,
      backgroundColor,
    },
    text: {
      color: textColor,
      fontSize: textSize,
      fontFamily: textFontFamily,
      textAlign: 'center',
    },
    leftIcon: {
      marginRight: spacing.Single,
    },
    rightIcon: {
      marginLeft: spacing.Single,
    },
  });
};
