import { navigationService } from '@/features/core/navigation';
import { useStartNewTrip } from '@/features/trips/facades/useStartNewTrip';

export const useStartNewTripCardLogic = () => {
  const { canStart } = useStartNewTrip();

  const handleStartNewTrip = () => {
    if (canStart()) navigationService.toSearch();
  };

  return { handleStartNewTrip };
};
