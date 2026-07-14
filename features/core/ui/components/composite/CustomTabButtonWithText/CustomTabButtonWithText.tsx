import type { TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef, type PropsWithChildren } from 'react';
import { Pressable, type View } from 'react-native';
import { CustomIcon, type IoniconsName } from '@/features/core/ui/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { styles } from '@/features/core/ui/components/composite/CustomTabButtonWithText/CustomTabButtonWithText.style';
import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';

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
