import { navigationService } from '@/features/core/navigation';

export const useStartNewTripCardLogic = () => {
  const handleStartNewTrip = () => navigationService.toSearch();

  return { handleStartNewTrip };
};
