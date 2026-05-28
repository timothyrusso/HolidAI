import { navigationService } from '@/features/core/navigation';

export const useTypicalDishesModalPageLogic = () => {
  const handleClose = () => navigationService.back();
  return { handleClose };
};
