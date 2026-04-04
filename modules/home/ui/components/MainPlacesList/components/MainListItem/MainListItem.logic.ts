import { useGetGooglePlaceImage } from '@/features/core/images';

export const useMainListItemLogic = (id?: string) => {
  const { data: imageResult } = useGetGooglePlaceImage(id ?? '', 50);

  const MIN_MAIN_LIST_ITEM_INDEX = 3;

  return { data: imageResult?.url, MIN_MAIN_LIST_ITEM_INDEX };
};
