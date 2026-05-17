import { BaseSkeleton, CustomIcon, CustomText, icons } from '@/features/core/ui';
import { styles as stylesFactory } from '@/features/profile/ui/components/LanguageItem/LanguageItem.style';
import type { FC } from 'react';
import { Pressable } from 'react-native';

type LanguageItemProps = {
  language: string;
  onPress: () => void;
  isSelected: boolean;
  isLoading: boolean;
};

export const LanguageItem: FC<LanguageItemProps> = ({ language, onPress, isSelected, isLoading }) => {
  const styles = stylesFactory(isSelected);

  return isLoading ? (
    <BaseSkeleton style={styles.skeleton} />
  ) : (
    <Pressable style={({ pressed }) => [styles.container, pressed ? styles.pressed : {}]} onPress={onPress}>
      <CustomText text={language} style={styles.language} />
      {isSelected && <CustomIcon name={icons.success} />}
    </Pressable>
  );
};
