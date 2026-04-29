import { styles } from '@/ui/components/basic/CustomText/CustomText.style';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type StyleProp, Text, type TextProps, type TextStyle } from 'react-native';

type CustomTextProps = TextProps & {
  text: string;
  style?: StyleProp<TextStyle>;
};
export const CustomText: FC<CustomTextProps> = ({ text, style, ...textProps }) => {
  const { t } = useTranslation();
  return (
    <Text style={[styles.text, style]} {...textProps}>
      {t(text)}
    </Text>
  );
};
