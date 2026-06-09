import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useLocalSearchParams } from 'expo-router';

const glutenFreeImage = require('@/features/core/ui/assets/images/gluten_free.png');
const veganImage = require('@/features/core/ui/assets/images/vegan.png');
const vegetarianImage = require('@/features/core/ui/assets/images/vegetarian.png');

export const useDishDetailsModalPageLogic = () => {
  const { tripId, searchTerm } = useLocalSearchParams<{ tripId: string; searchTerm: string }>();
  const { trip } = useGetTripById(tripId);

  const dish = trip?.tripAiResp?.food?.typicalDishes.find(d => d.searchTerm === searchTerm);

  const handleClose = () => navigationService.back();

  return {
    dishName: dish?.name ?? '',
    dishDescription: dish?.description ?? '',
    dishIngredients: dish?.ingredients ?? [],
    handleClose,
    image: dish?.imageUrl,
    isVegetarian: dish?.isVegetarian ?? false,
    isGlutenFree: dish?.isGlutenFree ?? false,
    isVegan: dish?.isVegan ?? false,
    glutenFreeImage,
    veganImage,
    vegetarianImage,
  };
};
