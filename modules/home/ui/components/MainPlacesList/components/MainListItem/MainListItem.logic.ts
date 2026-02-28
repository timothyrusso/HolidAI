import { useGooglePlaceImagesQuery } from '@/ui/queries/googlePlaceImages/query/useGooglePlaceImagesQuery';

export const useMainListItemLogic = (id?: string) => {
  const { data } = useGooglePlaceImagesQuery(id ?? '', 50);

  const MIN_MAIN_LIST_ITEM_INDEX = 3;

  return { data, MIN_MAIN_LIST_ITEM_INDEX };
};
