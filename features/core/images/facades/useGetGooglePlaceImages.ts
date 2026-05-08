import { useQuery } from '@tanstack/react-query';

import { fetchGooglePlaceImagesUseCase } from '@/features/core/images/di/resolve';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';

export const useGetGooglePlaceImages = (placeName: string, count: number, options?: ImageFetchOptions) => {
  const { data, isLoading } = useQuery<ImageResult[]>({
    queryKey: ['google-place-images', placeName, count, options],
    queryFn: async () => {
      const result = await fetchGooglePlaceImagesUseCase.execute(placeName, count, options);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!placeName,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data: data ?? [], isLoading };
};
