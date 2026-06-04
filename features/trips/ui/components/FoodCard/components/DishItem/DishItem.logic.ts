import { useGetWikimediaDishImage } from '@/features/core/images';
import type { TypicalDish } from '@/features/trips';

const glutenFreeImage = require('@/features/core/ui/assets/images/gluten_free.png');
const veganImage = require('@/features/core/ui/assets/images/vegan.png');
const vegetarianImage = require('@/features/core/ui/assets/images/vegetarian.png');

export const useDishItemLogic = (dish: TypicalDish) => {
  const { data, isLoading } = useGetWikimediaDishImage(dish.searchTerm);
  const hasBadge = dish.isGlutenFree || dish.isVegan || dish.isVegetarian;

  return {
    image: data?.url,
    isLoading,
    glutenFreeImage,
    veganImage,
    vegetarianImage,
    hasBadge,
    isGlutenFree: dish.isGlutenFree,
    isVegan: dish.isVegan,
    isVegetarian: dish.isVegetarian,
  };
};
