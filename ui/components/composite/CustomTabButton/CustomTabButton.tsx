import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import { type PropsWithChildren, forwardRef } from 'react';
import { Pressable, type View } from 'react-native';
import { CustomIcon, type IoniconsName } from '../../basic/CustomIcon/CustomIcon';
import { styles } from './CustomTabButton.style';

interface CustomTabButtonProps extends PropsWithChildren, TabTriggerSlotProps {
  icon: IoniconsName;
  onPress: () => void;
}

// biome-ignore lint: <ref is necessary for expo-router>
export const CustomTabButton = forwardRef<View, CustomTabButtonProps>((props, ref) => {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={props.onPress}>
      <CustomIcon name={props.icon} size={spacing.Fourfold} color={colors.primaryWhite} />
    </Pressable>
  );
});

CustomTabButton.displayName = 'CustomTabButton';
