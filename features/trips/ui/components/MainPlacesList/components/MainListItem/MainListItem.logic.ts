import { IMAGE_RESOLUTION, buildPlacePhotoUrlUseCase } from '@/features/core/images';

const MIN_MAIN_LIST_ITEM_INDEX = 3;

export const useMainListItemLogic = (photoResourceName: string | undefined) => {
  const data = photoResourceName
    ? buildPlacePhotoUrlUseCase.execute(photoResourceName, IMAGE_RESOLUTION.thumbnail)
    : undefined;
  return { data, MIN_MAIN_LIST_ITEM_INDEX };
};
