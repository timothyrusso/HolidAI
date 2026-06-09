import { navigationService } from '@/features/core/navigation';
import type { Trip } from '@/features/trips/domain/entities/Trip';

export const useTripCardLogic = (item: Trip) => {
  const location = item.tripAiResp.tripDetails.location.split(',')[0];

  const coverImage = item.tripAiResp.coverImage;
  const imageUrl = coverImage?.url;
  const imageBlurHash = coverImage?.blurHash || undefined;

  const onCardPress = () => navigationService.toTripDetails({ id: item._id });

  const isFavorite = item.isFavorite;

  return { imageUrl, imageBlurHash, location, onCardPress, isFavorite };
};
