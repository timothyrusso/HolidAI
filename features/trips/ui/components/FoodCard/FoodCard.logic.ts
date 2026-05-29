import { navigationService } from '@/features/core/navigation';
import type { Food } from '@/features/trips/domain/entities/Food';
import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';

export const useFoodCardLogic = (
  food: Food,
  tripId: string,
): { dishItems: TypicalDish[]; handleOpenModal: () => void } => {
  const handleOpenModal = () => navigationService.toTypicalDishesModal({ tripId });

  return { dishItems: food.typicalDishes, handleOpenModal };
};
