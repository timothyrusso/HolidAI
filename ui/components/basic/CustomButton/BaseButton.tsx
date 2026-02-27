import { Fragment } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { match } from 'ts-pattern';

import { spacing } from '@/ui/style/dimensions/spacing';
import { CustomIcon, type IoniconsName } from '../CustomIcon/CustomIcon';
import CustomText from '../CustomText/CustomText';
import { ButtonState, ButtonType, useCustomButtonLogic } from './CustomButton.logic';
import { styleButton } from './CustomButton.style';

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

  const { styleIconColor, getButtonStyles } = useCustomButtonLogic();

  const styles = styleButton(buttonType, buttonState, getButtonStyles, size, leftIcon, rightIcon);

  const iconColor = styleIconColor(buttonType, buttonState);

  return (
    <Pressable
      disabled={isDisabled || isLoading}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.innerContainer}>
        {isLoading ? (
          <ActivityIndicator color={styles.text.color} />
        ) : (
          <Fragment>
            {leftIcon && (
              <CustomIcon name={leftIcon} size={iconSize} style={[styles.icon, leftIconStyle]} color={iconColor} />
            )}
            {title && (
              <CustomText style={[styles.text, textStyle]} text={title} numberOfLines={1} ellipsizeMode="tail" />
            )}
            {rightIcon && (
              <CustomIcon name={rightIcon} size={iconSize} style={[styles.icon, rightIconStyle]} color={iconColor} />
            )}
          </Fragment>
        )}
      </View>
    </Pressable>
  );
}
