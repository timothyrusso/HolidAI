import { logger } from '@/di/resolve';
import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { UnsplashImagesKeys } from '../UnsplashImagesKeys';

const _unsplashAccessKey = Constants.expoConfig?.extra?.unsplashAccessKey;

const noImage = require('../../../assets/images/no-image-placeholder.jpg');

export enum UrlTypes {
  FULL = 'full',
  REGULAR = 'regular',
  SMALL = 'small',
  THUMB = 'thumb',
}

const getUnsplashImages = async (placeName: string, urlType: UrlTypes) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${placeName}&client_id=${_unsplashAccessKey}`,
    );
    const data = await response.json();

    if (data.results) {
      return data.results[0].urls[urlType];
    }

    return noImage;
  } catch (error) {
    logger.error(new Error('Failed to fetch unsplash images:'), error);
    return noImage;
  }
};

export const useUnsplashImages = (placeName: string, urlType: UrlTypes) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [UnsplashImagesKeys.getUnsplashImages, placeName, urlType],
    queryFn: () => getUnsplashImages(placeName, urlType),
    enabled: !!placeName,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data, isLoading, error };
};
