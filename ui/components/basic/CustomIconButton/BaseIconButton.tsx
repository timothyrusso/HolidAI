import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

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
}: CustomIconButtonProps) {
  const buttonState = isDisabled ? ButtonState.Disabled : ButtonState.Active;

  const { styleIconColor, getButtonStyles } = useCustomButtonLogic();

  const styles = styleButton(buttonType, buttonState, getButtonStyles, size);
  const iconColor = styleIconColor(buttonType, buttonState);

  return (
    <Pressable
      disabled={isDisabled || isLoading}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator color={iconColor} size={iconSize} />
      ) : (
        <CustomIcon name={iconName} size={iconSize} style={iconStyle} color={iconColor} />
      )}
    </Pressable>
  );
}
