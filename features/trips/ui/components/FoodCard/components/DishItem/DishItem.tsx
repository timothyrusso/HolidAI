import { BaseSkeleton, CustomImage, CustomText } from '@/features/core/ui';
import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';
import { useDishItemLogic } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem.logic';
import { styles } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem.style';
import type { FC } from 'react';
import { View } from 'react-native';

type DishItemProps = { dish: TypicalDish };

export const DishItem: FC<DishItemProps> = ({ dish }) => {
  const { image, isLoading } = useDishItemLogic(dish.searchTerm);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <BaseSkeleton style={styles.skeleton} />
      ) : (
        <CustomImage source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
      )}
      <CustomText text={dish.name} style={styles.label} numberOfLines={1} ellipsizeMode="tail" />
    </View>
  );
};
