import type { Food } from '@/features/trips/domain/entities/Food';
import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';

export const useFoodCardLogic = (food: Food): { dishItems: TypicalDish[] } => {
  return { dishItems: food.typicalDishes };
};
