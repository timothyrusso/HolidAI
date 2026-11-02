import { IMAGE_RESOLUTION, usePlacePhotoUrls } from '@/features/core/images';

const MIN_MAIN_LIST_ITEM_INDEX = 3;

export const useMainListItemLogic = (photoResourceName: string | undefined) => {
  const [data] = usePlacePhotoUrls(photoResourceName ? [photoResourceName] : [], IMAGE_RESOLUTION.thumbnail);
  return {
    state: { MIN_MAIN_LIST_ITEM_INDEX },
    derived: { data },
  };
};
