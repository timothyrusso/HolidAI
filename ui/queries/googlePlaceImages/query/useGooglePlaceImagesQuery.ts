import { logger } from '@/di/resolve';
import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { GooglePlaceImagesKeys } from '../GooglePlaceImagesKeys';

export const useGooglePlaceImagesQuery = (placeName: string, maxWidthPx = 500) => {
  const _googleApiKey = Constants.expoConfig?.extra?.googlePlacesApiKey || '';

  const noImage = require('../../../assets/images/no-image-placeholder.jpg');

  const { data, isFetching } = useQuery({
    queryKey: [GooglePlaceImagesKeys.getGooglePlaceImages, placeName, maxWidthPx],
    queryFn: () => getImage(placeName),
    enabled: !!placeName,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const getImage = async (placeName: string) => {
    if (!placeName) {
      logger.log('No place name provided');
      return noImage;
    }

    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': _googleApiKey,
          'X-Goog-FieldMask': 'places.id,places.photos',
        },
        body: JSON.stringify({
          textQuery: placeName,
        }),
      });

      const data = await response.json();

      if (data?.places?.length > 0 && data.places[0]?.photos?.length > 0) {
        const photoReference = data.places[0].photos[0].name;
        return photoReference
          ? `https://places.googleapis.com/v1/${photoReference}/media?key=${_googleApiKey}&maxWidthPx=${maxWidthPx}`
          : noImage;
      }

      logger.log('No photo found for place:', placeName);
      return noImage;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Failed to fetch place ID:', error.message);
      } else {
        logger.error(new Error(error as string), 'Failed to fetch place ID:', error);
      }
      return noImage;
    }
  };

  return { data, isLoading: isFetching };
};
