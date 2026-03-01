import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { spacing } from '@/ui/style/dimensions/spacing';
import { ButtonState, ButtonType, useCustomButtonLogic } from '../CustomButton/CustomButton.logic';
import { CustomIcon, type IoniconsName } from '../CustomIcon/CustomIcon';
import { styleButton } from './CustomIconButton.style';

export type CustomIconButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  isDisabled?: boolean;
  buttonType?: ButtonType;
  size?: number;
  iconName: IoniconsName;
  iconSize?: number;
  iconStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  animatedIconStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  noPressedStyle?: boolean;
};

export function BaseIconButton({
  style,
  onPress,
  isDisabled = false,
  buttonType = ButtonType.Primary,
  size,
  iconName,
  iconSize = spacing.TripleAndHalf,
  iconStyle,
  isLoading = false,
  animatedIconStyle,
  noPressedStyle = false,
}: CustomIconButtonProps) {
  const buttonState = isDisabled ? ButtonState.Disabled : ButtonState.Active;

  const { styleIconColor, getButtonStyles } = useCustomButtonLogic();

  const styles = styleButton(buttonType, buttonState, getButtonStyles, size);
  const iconColor = styleIconColor(buttonType, buttonState);

  const icon = <CustomIcon name={iconName} size={iconSize} style={iconStyle} color={iconColor} />;

  return (
    <Pressable
      disabled={isDisabled || isLoading}
      style={({ pressed }) => [styles.button, style, pressed && !noPressedStyle && styles.pressed]}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator color={iconColor} size={iconSize} />
      ) : animatedIconStyle !== undefined ? (
        <Animated.View style={animatedIconStyle}>{icon}</Animated.View>
      ) : (
        icon
      )}
    </Pressable>
  );
}
