import { StyleSheet } from 'react-native';

import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import type { ButtonState, ButtonType } from './BaseIconButton';

export type ButtonStyles = {
  backgroundColor: string;
  borderColor: string;
};

export const styleButton = (
  buttonType: ButtonType,
  buttonState: ButtonState,
  getButtonStyles: (buttonType: ButtonType, buttonState: ButtonState) => ButtonStyles,
  height = components.buttonLargeHeight,
) => {
  const buttonStyles = getButtonStyles(buttonType, buttonState);

  return StyleSheet.create({
    button: {
      height: height,
      width: height,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 0,
      marginHorizontal: 0,
      borderRadius: spacing.separator80,
      borderWidth: spacing.Minimal,
      borderColor: buttonStyles.borderColor,
      backgroundColor: buttonStyles.backgroundColor,
    },
    pressed: {
      opacity: 0.6,
    },
  });
};
