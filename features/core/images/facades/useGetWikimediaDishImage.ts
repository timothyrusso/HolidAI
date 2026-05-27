import { useQuery } from '@tanstack/react-query';

import { fetchWikimediaDishImageUseCase } from '@/features/core/images/di/resolve';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';

const fallback: ImageResult = { url: require('@/features/core/ui/assets/images/no-image-placeholder.jpg') };

export const useGetWikimediaDishImage = (dish: string) => {
  const { data, isLoading, isError } = useQuery<ImageResult>({
    queryKey: ['wikimedia-dish-image', dish],
    queryFn: async () => {
      const result = await fetchWikimediaDishImageUseCase.execute(dish);
      if (!result.success) throw result.error;
      return result.data ?? fallback;
    },
    enabled: !!dish,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data: isError ? fallback : data, isLoading };
};
