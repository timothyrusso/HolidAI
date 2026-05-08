import { ActivityIndicator, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { ButtonState, ButtonType, useCustomButtonLogic } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomIcon, type IoniconsName } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { styleButton } from '@/ui/components/basic/CustomIconButton/CustomIconButton.style';
import { CustomPressable } from '@/ui/components/basic/CustomPressable/CustomPressable';
import { spacing } from '@/ui/style/dimensions/spacing';

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
} & ViewProps;

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
    <CustomPressable
      disabled={isDisabled || isLoading}
      style={[styles.button, style]}
      scaleValue={noPressedStyle ? 1 : 1.2}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator color={iconColor} size={iconSize} />
      ) : animatedIconStyle !== undefined ? (
        <Animated.View style={animatedIconStyle}>{icon}</Animated.View>
      ) : (
        icon
      )}
    </CustomPressable>
  );
}
