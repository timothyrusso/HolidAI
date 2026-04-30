import { StyleSheet } from 'react-native';

import { type ButtonState, ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import type { IoniconsName } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { components } from '@/ui/style/dimensions/components';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { opacity } from '@/ui/style/opacity';

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
      borderRadius: spacing.FourfoldAndHalf,
      borderWidth: spacing.Minimal,
      borderColor: buttonStyles.borderColor,
      backgroundColor: buttonStyles.backgroundColor,
    },
    text: {
      width: '100%',
      color: buttonStyles.textColor,
      textDecorationLine: buttonType === ButtonType.Ghost ? 'underline' : undefined,
      fontFamily: fontFamily.interBold,
      fontSize: fontSize.LG,
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
