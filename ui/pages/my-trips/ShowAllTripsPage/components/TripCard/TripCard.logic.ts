import type { UserTrips } from '@/modules/trip/domain/dto/UserTripsDTO';
import { Routes, Stacks } from '@/ui/constants/routes';
import { UrlTypes, useUnsplashImages } from '@/ui/queries/unsplashImages/query/useUnsplashImages';
import { useRouter } from 'expo-router';

export const useTripCardLogic = (item: UserTrips) => {
  const router = useRouter();

  const location = item.tripAiResp.tripDetails.location.split(',')[0];

  const { data: imageUrl } = useUnsplashImages(location, UrlTypes.REGULAR);

  const onCardPress = () => {
    router.push({
      pathname: `/${Stacks.CreateTrip}/${Routes.TripDetails}`,
      params: { id: item.docId },
    });
  };

  const isFavorite = item.isFavorite;

  return { imageUrl, location, onCardPress, isFavorite };
};
