import type { Food } from '@/features/trips/domain/entities/Food';

export type DishItem = {
  dish: string;
  searchTerm: string;
};

export const useFoodCardLogic = (food: Food) => {
  const dishItems: DishItem[] = food.typicalDishes.map((dish, i) => ({
    dish,
    searchTerm: food.typicalDishesSearchTerms?.[i] ?? dish,
  }));

  return { dishItems };
};
