import { useGetWikimediaDishImage } from '@/features/core/images';

export const useDishItemLogic = (searchTerm: string) => {
  const { data, isLoading } = useGetWikimediaDishImage(searchTerm);
  return { image: data?.url, isLoading };
};
