import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import { type PropsWithChildren, forwardRef } from 'react';
import { Pressable, type View } from 'react-native';
import { CustomIcon, type IoniconsName } from '../../basic/CustomIcon/CustomIcon';
import CustomText from '../../basic/CustomText/CustomText';
import { styles } from './CustomTabButtonWithText.style';
interface CustomTabButtonWithTextProps extends PropsWithChildren, TabTriggerSlotProps {
  icon: IoniconsName;
}

export const CustomTabButtonWithText = forwardRef<View, CustomTabButtonWithTextProps>((props, ref) => {
  return (
    <Pressable ref={ref} {...props} style={[styles.button]}>
      <CustomIcon
        name={props.icon}
        size={spacing.Fourfold}
        color={props.isFocused ? colors.primary : colors.primaryGrey}
      />
      <CustomText style={[styles.text, props.isFocused && styles.focusedText]} text={props.children as string} />
    </Pressable>
  );
});

CustomTabButtonWithText.displayName = 'CustomTabButtonWithText';
