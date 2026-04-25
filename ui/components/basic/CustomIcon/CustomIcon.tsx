import { Ionicons } from '@expo/vector-icons';
import type { ViewProps } from 'react-native';
import { type GestureResponderEvent, type OpaqueColorValue, type StyleProp, View, type ViewStyle } from 'react-native';
import { styles } from './CustomIcon.style';

export const DEFAULT_ICON_SIZE = 30;

export type IoniconsName = keyof typeof Ionicons.glyphMap;

export type CustomIconProps = {
  disabled?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  size?: number | undefined;
  name: IoniconsName;
  color?: string | OpaqueColorValue | undefined;
  style?: StyleProp<ViewStyle>;
  isDarkThemed?: boolean;
  isOutlined?: boolean;
} & ViewProps;

export const CustomIcon = ({
  disabled = false,
  onPress,
  name,
  size = DEFAULT_ICON_SIZE,
  color,
  style = {},
  isOutlined,
}: CustomIconProps) => {
  return (
    <View style={[styles().icon, isOutlined && styles().iconOutline, style]}>
      <Ionicons
        name={name}
        size={size}
        color={color}
        onPress={onPress}
        disabled={disabled}
        style={[styles().icon, styles(size).iconSize]}
      />
    </View>
  );
};
