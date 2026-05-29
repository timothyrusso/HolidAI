import { navigationService } from '@/features/core/navigation';

export const useFoodCardLogic = (tripId: string): { handleOpenModal: () => void } => {
  const handleOpenModal = () => navigationService.toTypicalDishesModal({ tripId });

  return { handleOpenModal };
};
