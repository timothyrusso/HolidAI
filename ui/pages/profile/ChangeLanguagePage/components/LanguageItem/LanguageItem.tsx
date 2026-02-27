import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { icons } from '@/ui/style/icons';
import type { FC } from 'react';
import { Pressable } from 'react-native';
import { styles as stylesFactory } from './LanguageItem.style';

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
