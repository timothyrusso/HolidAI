import { StyleSheet } from 'react-native';

import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { opacity } from '@/ui/constants/style/opacity';
import type { IoniconsName } from '../CustomIcon/CustomIcon';
import { type ButtonState, ButtonType } from './CustomButton.logic';

export type ButtonStyles = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

export const styleButton = (
  buttonType: ButtonType,
  buttonState: ButtonState,
  getButtonStyles: (buttonType: ButtonType, buttonState: ButtonState) => ButtonStyles,
  height = components.buttonLargeHeight,
  leftIcon?: IoniconsName,
  rightIcon?: IoniconsName,
) => {
  const buttonStyles = getButtonStyles(buttonType, buttonState);

  return StyleSheet.create({
    innerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      width: '100%',
      height: height,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 0,
      marginHorizontal: 0,
      borderRadius: spacing.Double,
      borderWidth: spacing.Minimal,
      borderColor: buttonStyles.borderColor,
      backgroundColor: buttonStyles.backgroundColor,
    },
    text: {
      width: '100%',
      color: buttonStyles.textColor,
      textDecorationLine: buttonType === ButtonType.Ghost ? 'underline' : undefined,
      fontFamily: fonts.interBold,
      fontSize: spacing.Triple,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    icon: {
      marginLeft: rightIcon ? spacing.SingleAndHalf : 0,
      marginRight: leftIcon ? spacing.SingleAndHalf : 0,
    },
    pressed: {
      opacity: opacity.default,
    },
  });
};
