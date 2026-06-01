import { navigationService } from '@/features/core/navigation';
import { useLocalSearchParams } from 'expo-router';

export const useDishDetailsModalPageLogic = () => {
  const { tripId, searchTerm } = useLocalSearchParams<{ tripId: string; searchTerm: string }>();

  const handleClose = () => navigationService.back();

  return { tripId, searchTerm, handleClose };
};
