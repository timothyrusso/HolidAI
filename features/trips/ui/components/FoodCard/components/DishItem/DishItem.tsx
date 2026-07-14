import type { FC } from 'react';
import { Pressable, View } from 'react-native';
import { CustomImage, CustomText } from '@/features/core/ui';
import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';
import { useDishItemLogic } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem.logic';
import { styles } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem.style';

type DishItemProps = { dish: TypicalDish; onPress: () => void };

export const DishItem: FC<DishItemProps> = ({ dish, onPress }) => {
  const {
    name,
    description,
    image,
    glutenFreeImage,
    veganImage,
    vegetarianImage,
    hasBadge,
    isGlutenFree,
    isVegan,
    isVegetarian,
    glutenFreeLabel,
    veganLabel,
    vegetarianLabel,
  } = useDishItemLogic(dish);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <View>
        <CustomImage source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <CustomText text={name} style={styles.title} numberOfLines={1} ellipsizeMode="tail" />
        <CustomText
          text={description}
          style={styles.description}
          numberOfLines={hasBadge ? 2 : 3}
          ellipsizeMode="tail"
        />
        {hasBadge && (
          <View style={styles.badgeContainer}>
            {isGlutenFree && (
              <CustomImage source={glutenFreeImage} style={styles.badge} accessibilityLabel={glutenFreeLabel} />
            )}
            {isVegan && <CustomImage source={veganImage} style={styles.badge} accessibilityLabel={veganLabel} />}
            {isVegetarian && (
              <CustomImage source={vegetarianImage} style={styles.badge} accessibilityLabel={vegetarianLabel} />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};
