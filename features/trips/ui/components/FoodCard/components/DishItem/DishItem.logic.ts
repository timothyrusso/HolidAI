import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';

const glutenFreeImage = require('@/features/core/ui/assets/images/gluten_free.png');
const veganImage = require('@/features/core/ui/assets/images/vegan.png');
const vegetarianImage = require('@/features/core/ui/assets/images/vegetarian.png');

export const useDishItemLogic = (dish: TypicalDish) => {
  const hasBadge = dish.isGlutenFree || dish.isVegan || dish.isVegetarian;

  return {
    image: dish.imageUrl,
    glutenFreeImage,
    veganImage,
    vegetarianImage,
    hasBadge,
    isGlutenFree: dish.isGlutenFree,
    isVegan: dish.isVegan,
    isVegetarian: dish.isVegetarian,
    glutenFreeLabel: 'MY_TRIP.GLUTEN_FREE',
    veganLabel: 'MY_TRIP.VEGAN',
    vegetarianLabel: 'MY_TRIP.VEGETARIAN',
  };
};
