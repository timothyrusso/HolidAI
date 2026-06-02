import { useGetWikimediaDishImage } from '@/features/core/images/facades/useGetWikimediaDishImage';
import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useLocalSearchParams } from 'expo-router';

export const useDishDetailsModalPageLogic = () => {
  const { tripId, searchTerm } = useLocalSearchParams<{ tripId: string; searchTerm: string }>();
  const { data, isLoading } = useGetWikimediaDishImage(searchTerm);
  const { trip } = useGetTripById(tripId);

  const dish = trip?.tripAiResp?.food?.typicalDishes.find(d => d.searchTerm === searchTerm);
  const dishName = dish?.name ?? '';
  const dishDescription = dish?.description ?? '';

  const handleClose = () => navigationService.back();

  return { dishName, dishDescription, handleClose, image: data?.url, imageIsLoading: isLoading };
};
