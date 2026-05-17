import { StyleSheet } from 'react-native';

import type { ButtonState, ButtonType } from '@/features/core/ui/components/basic/CustomButton/CustomButton.logic';
import { components } from '@/features/core/ui/style/dimensions/components';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { opacity } from '@/features/core/ui/style/opacity';

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
      opacity: opacity.default,
    },
  });
};
