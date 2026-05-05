import { Fragment, useState } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { EaseView } from 'react-native-ease';
import { match } from 'ts-pattern';

import { ButtonState, ButtonType, useCustomButtonLogic } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { styleButton } from '@/ui/components/basic/CustomButton/CustomButton.style';
import { CustomIcon, type IoniconsName } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import { easeTransitions } from '@/ui/style/animations';
import { spacing } from '@/ui/style/dimensions/spacing';

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

  const [pressed, setPressed] = useState<boolean>(false);

  return (
    <EaseView
      animate={{
        scale: pressed ? 0.9 : 1,
      }}
      transition={easeTransitions.buttonPress}
      style={[styles.button, style]}
    >
      <Pressable
        disabled={isDisabled || isLoading}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        style={styles.innerContainer}
      >
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
      </Pressable>
    </EaseView>
  );
}
