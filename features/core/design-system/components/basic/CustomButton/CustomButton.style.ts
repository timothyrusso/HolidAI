import { StyleSheet } from 'react-native';

import {
  type ButtonState,
  ButtonType,
} from '@/features/core/design-system/components/basic/CustomButton/CustomButton.logic';
import { components } from '@/features/core/design-system/style/dimensions/components';
import { fontSize } from '@/features/core/design-system/style/dimensions/fontSize';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { fontFamily } from '@/features/core/design-system/style/fontFamily';

export type ButtonStyles = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

export const styleButton = (
  buttonType: ButtonType,
  buttonState: ButtonState,
  getButtonStyles: (buttonType: ButtonType, buttonState: ButtonState) => ButtonStyles,
  height: number = components.buttonLargeHeight,
) => {
  const buttonStyles = getButtonStyles(buttonType, buttonState);

  return StyleSheet.create({
    innerContainer: {
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
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
      // `flexShrink` rather than `width: '100%'`: a full-width label absorbs every spare pixel in
      // the row, which pinned any icon hard against the pill's rounded edge no matter what margin
      // it carried. Shrinking instead lets `justifyContent: 'center'` centre the whole
      // icon/label/icon group, and still lets `numberOfLines`/`ellipsizeMode` truncate a long title.
      flexShrink: 1,
      color: buttonStyles.textColor,
      textDecorationLine: buttonType === ButtonType.Ghost ? 'underline' : undefined,
      fontFamily: fontFamily.interBold,
      fontSize: fontSize.LG,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    // One style per side, mirroring Custom3DButton. A single shared style could not express this:
    // it was applied to BOTH icons, so each got the left AND right margin, while the outer side of
    // a lone icon got none — which is why a single icon sat flush against the edge.
    leftIcon: {
      marginRight: spacing.Single,
    },
    rightIcon: {
      marginLeft: spacing.Single,
    },
  });
};
