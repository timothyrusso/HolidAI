import { useGetGooglePlaceImage } from '@/features/core/images';

const MIN_MAIN_LIST_ITEM_INDEX = 3;

export const useMainListItemLogic = (id?: string) => {
  const { data: imageResult } = useGetGooglePlaceImage(id ?? '', 50);

  return { data: imageResult?.url, MIN_MAIN_LIST_ITEM_INDEX };
};
