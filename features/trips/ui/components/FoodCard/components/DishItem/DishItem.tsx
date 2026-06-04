import { BaseSkeleton, CustomImage, CustomText } from '@/features/core/ui';
import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';
import { useDishItemLogic } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem.logic';
import { styles } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem.style';
import type { FC } from 'react';
import { Pressable, View } from 'react-native';

type DishItemProps = { dish: TypicalDish; onPress: () => void };

export const DishItem: FC<DishItemProps> = ({ dish, onPress }) => {
  const {
    image,
    isLoading,
    glutenFreeImage,
    veganImage,
    vegetarianImage,
    hasBadge,
    isGlutenFree,
    isVegan,
    isVegetarian,
  } = useDishItemLogic(dish);

  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={onPress}>
      <View>
        {isLoading ? (
          <BaseSkeleton style={styles.skeleton} />
        ) : (
          <CustomImage source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
        )}
      </View>
      <View style={styles.textContainer}>
        <CustomText text={dish.name} style={styles.title} numberOfLines={1} ellipsizeMode="tail" />
        <CustomText
          text={dish.description}
          style={styles.description}
          numberOfLines={hasBadge ? 2 : 3}
          ellipsizeMode="tail"
        />
        {hasBadge && (
          <View style={styles.badgeContainer}>
            {isGlutenFree && <CustomImage source={glutenFreeImage} style={styles.badge} />}
            {isVegan && <CustomImage source={veganImage} style={styles.badge} />}
            {isVegetarian && <CustomImage source={vegetarianImage} style={styles.badge} />}
          </View>
        )}
      </View>
    </Pressable>
  );
};
