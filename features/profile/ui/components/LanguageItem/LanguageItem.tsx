import type { FC } from 'react';
import { Pressable } from 'react-native';
import { CustomIcon, CustomText, icons } from '@/features/core/design-system';
import { styles as stylesFactory } from '@/features/profile/ui/components/LanguageItem/LanguageItem.style';

type LanguageItemProps = {
  language: string;
  onPress: () => void;
  isSelected: boolean;
};

export const LanguageItem: FC<LanguageItemProps> = ({ language, onPress, isSelected }) => {
  const styles = stylesFactory(isSelected);

  return (
    <Pressable style={({ pressed }) => [styles.container, pressed ? styles.pressed : {}]} onPress={onPress}>
      <CustomText text={language} style={styles.language} />
      {isSelected && <CustomIcon name={icons.success} />}
    </Pressable>
  );
};
