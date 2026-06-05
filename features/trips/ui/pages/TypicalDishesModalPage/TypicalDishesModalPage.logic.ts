import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useLocalSearchParams } from 'expo-router';

export const useTypicalDishesModalPageLogic = () => {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useGetTripById(tripId);

  const location = trip?.tripAiResp?.tripDetails?.location?.split(',')[0] ?? '';
  const food = trip?.tripAiResp?.food;
  const dishNumber = food?.typicalDishes.length ?? 0;

  const handleClose = () => navigationService.back();
  const handleDishPress = (searchTerm: string) => navigationService.toDishDetailsModal({ tripId, searchTerm });

  return { handleClose, handleDishPress, location, dishNumber, dishItems: food?.typicalDishes };
};
