import { CustomIcon, CustomText, colors, icons, spacing } from '@/features/core/ui';
import { styles } from '@/features/trips/ui/components/OpenMapButton/OpenMapButton.style';
import type { FC } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

type OpenMapButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const OpenMapButton: FC<OpenMapButtonProps> = ({ onPress, style }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, style, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <CustomIcon name={icons.location} size={spacing.Triple} color={colors.primaryBlack} style={styles.icon} />
      <CustomText text="ACTIVITY_DETAILS.OPEN_MAP" style={styles.title} />
    </Pressable>
  );
};
