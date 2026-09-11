import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import {
  ButtonState,
  ButtonType,
  useCustomButtonLogic,
} from '@/features/core/design-system/components/basic/CustomButton/CustomButton.logic';
import { CustomIcon, type IoniconsName } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { styleButton } from '@/features/core/design-system/components/basic/CustomIconButton/CustomIconButton.style';
import { CustomPressable } from '@/features/core/design-system/components/basic/CustomPressable/CustomPressable';
import { CustomSpinner } from '@/features/core/design-system/components/basic/CustomSpinner/CustomSpinner';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

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
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}: CustomIconButtonProps) {
  const buttonState = isDisabled ? ButtonState.Disabled : ButtonState.Active;

  const { derived } = useCustomButtonLogic();

  const styles = styleButton(buttonType, buttonState, derived.getButtonStyles, size);
  const iconColor = derived.styleIconColor(buttonType, buttonState);

  const icon = <CustomIcon name={iconName} size={iconSize} style={iconStyle} color={iconColor} />;

  return (
    <CustomPressable
      disabled={isDisabled || isLoading}
      style={[styles.button, style]}
      scaleValue={noPressedStyle ? 1 : 1.2}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
    >
      {isLoading ? (
        <CustomSpinner size="small" color={derived.styleSpinnerColor(buttonType)} />
      ) : animatedIconStyle !== undefined ? (
        <Animated.View style={animatedIconStyle}>{icon}</Animated.View>
      ) : (
        icon
      )}
    </CustomPressable>
  );
}
