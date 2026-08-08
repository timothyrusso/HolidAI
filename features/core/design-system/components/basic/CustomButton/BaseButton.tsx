import { Fragment } from 'react';
import { ActivityIndicator, type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { match } from 'ts-pattern';

import {
  ButtonState,
  ButtonType,
  useCustomButtonLogic,
} from '@/features/core/design-system/components/basic/CustomButton/CustomButton.logic';
import { styleButton } from '@/features/core/design-system/components/basic/CustomButton/CustomButton.style';
import { CustomIcon, type IoniconsName } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { CustomPressable } from '@/features/core/design-system/components/basic/CustomPressable/CustomPressable';
import { CustomText } from '@/features/core/design-system/components/basic/CustomText/CustomText';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

export type CustomButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  isDisabled?: boolean;
  isLoading?: boolean;
  buttonType?: ButtonType;
  size?: number;
  leftIcon?: IoniconsName;
  rightIcon?: IoniconsName;
  iconSize?: number;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;
};

export function BaseButton({
  title,
  onPress,
  style,
  textStyle,
  isDisabled = false,
  isLoading = false,
  buttonType = ButtonType.Primary,
  size,
  leftIcon,
  rightIcon,
  iconSize = spacing.TripleAndHalf,
  leftIconStyle,
  rightIconStyle,
}: CustomButtonProps) {
  const buttonState = match({ isDisabled, isLoading })
    .with({ isDisabled: true }, () => ButtonState.Disabled)
    .with({ isLoading: true }, () => ButtonState.Disabled)
    .otherwise(() => ButtonState.Active);

  const { derived } = useCustomButtonLogic();

  const styles = styleButton(buttonType, buttonState, derived.getButtonStyles, size);

  const iconColor = derived.styleIconColor(buttonType, buttonState);

  return (
    <CustomPressable disabled={isDisabled || isLoading} onPress={onPress} style={[styles.button, style]}>
      <View style={styles.innerContainer}>
        {isLoading ? (
          // `iconColor`, not `styles.text.color`: a spinner is a glyph, so it takes the same
          // `styleIconColor` token BaseIconButton's spinner uses. Sourcing it from the text color
          // made the two components' spinners differ for Main/Primary disabled, where
          // `getButtonStyles` returns primaryWhite but `styleIconColor` returns primaryWhiteDisabled.
          <ActivityIndicator color={iconColor} />
        ) : (
          <Fragment>
            {leftIcon && (
              <CustomIcon name={leftIcon} size={iconSize} style={[styles.leftIcon, leftIconStyle]} color={iconColor} />
            )}
            {title && (
              <CustomText style={[styles.text, textStyle]} text={title} numberOfLines={1} ellipsizeMode="tail" />
            )}
            {rightIcon && (
              <CustomIcon
                name={rightIcon}
                size={iconSize}
                style={[styles.rightIcon, rightIconStyle]}
                color={iconColor}
              />
            )}
          </Fragment>
        )}
      </View>
    </CustomPressable>
  );
}
