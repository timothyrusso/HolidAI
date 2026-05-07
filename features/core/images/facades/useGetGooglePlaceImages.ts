import { useQuery } from '@tanstack/react-query';

import { fetchGooglePlaceImagesUseCase } from '@/features/core/images/di/resolve';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';

export const useGetGooglePlaceImages = (placeName: string, count: number) => {
  const { data, isLoading } = useQuery<ImageResult[]>({
    queryKey: ['google-place-images', placeName, count],
    queryFn: async () => {
      const result = await fetchGooglePlaceImagesUseCase.execute(placeName, count);
      return result.success ? result.data : [];
    },
    enabled: !!placeName,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data: data ?? [], isLoading };
};
