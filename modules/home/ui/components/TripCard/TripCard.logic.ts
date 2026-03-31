import { navigationService } from '@/features/core/navigation';
import type { UserTrips } from '@/modules/trips/domain/dto/UserTripsDTO';
import { UrlTypes, useUnsplashImages } from '@/ui/queries/unsplashImages/query/useUnsplashImages';

export const useTripCardLogic = (item: UserTrips) => {
  const location = item.tripAiResp.tripDetails.location.split(',')[0];

  const { data: unsplashImage } = useUnsplashImages(location, UrlTypes.REGULAR);
  const imageUrl = unsplashImage?.url;
  const imageBlurHash = unsplashImage?.blurHash;

  const onCardPress = () => navigationService.toTripDetails({ id: item._id });

  const isFavorite = item.isFavorite;

  return { imageUrl, imageBlurHash, location, onCardPress, isFavorite };
};
