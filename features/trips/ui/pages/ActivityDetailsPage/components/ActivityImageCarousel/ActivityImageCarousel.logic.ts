import { useGetGooglePlaceImages } from '@/features/core/images';

const MIN_IMAGES = 2;
const MAX_IMAGES = 5;

export const useActivityImageCarouselLogic = (imageLocationName: string) => {
  const { data: allImages, isLoading } = useGetGooglePlaceImages(imageLocationName, MAX_IMAGES + 1);
  const images = allImages.slice(1); // first photo is already used by the page header
  const shouldShow = isLoading || images.length >= MIN_IMAGES;

  return { images, isLoading, shouldShow };
};
