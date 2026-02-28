import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import type { FC } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from './OpenMapButton.style';

type OpenMapButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const OpenMapButton: FC<OpenMapButtonProps> = ({ onPress, style }) => {
  return (
    <Pressable style={({ pressed }) => [styles.container, style, pressed && styles.pressed]} onPress={onPress}>
      <CustomIcon name={icons.location} size={spacing.Triple} color={colors.primaryBlack} style={styles.icon} />
      <CustomText text="ACTIVITY_DETAILS.OPEN_MAP" style={styles.title} />
    </Pressable>
  );
};
