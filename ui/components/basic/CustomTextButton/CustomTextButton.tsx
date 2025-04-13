import CustomText from '@/ui/components/basic/CustomText/CustomText';
import type { FC } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from './CustomTextButton.style';

type CustomTextButtonProps = {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
};

export const CustomTextButton: FC<CustomTextButtonProps> = ({ onPress, title, style }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.main, style, pressed && styles.pressed]}>
      <CustomText text={title} />
    </Pressable>
  );
};
