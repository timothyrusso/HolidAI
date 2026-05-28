import { navigationService } from '@/features/core/navigation';
import type { Food } from '@/features/trips/domain/entities/Food';
import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';

export const useFoodCardLogic = (food: Food): { dishItems: TypicalDish[]; handleOpenModal: () => void } => {
  const handleOpenModal = () => navigationService.toTypicalDishesModal();
  return { dishItems: food.typicalDishes, handleOpenModal };
};
