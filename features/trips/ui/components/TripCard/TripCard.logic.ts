import { UrlType, useGetUnsplashImage } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import type { Trip } from '@/features/trips';

export const useTripCardLogic = (item: Trip) => {
  const location = item.tripAiResp.tripDetails.location.split(',')[0];

  const { data: unsplashImage } = useGetUnsplashImage(location, UrlType.REGULAR);
  const imageUrl = unsplashImage?.url;
  const imageBlurHash = unsplashImage?.blurHash;

  const onCardPress = () => navigationService.toTripDetails({ id: item._id });

  const isFavorite = item.isFavorite;

  return { imageUrl, imageBlurHash, location, onCardPress, isFavorite };
};
