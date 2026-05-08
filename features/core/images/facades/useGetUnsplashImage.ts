import { useQuery } from '@tanstack/react-query';

import { fetchUnsplashImageUseCase } from '@/features/core/images/di/resolve';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import type { UrlType } from '@/features/core/images/domain/entities/UrlType';

const fallback: ImageResult = { url: require('@/ui/assets/images/no-image-placeholder.jpg') };

export const useGetUnsplashImage = (placeName: string, urlType: UrlType) => {
  const { data, isLoading, isError } = useQuery<ImageResult>({
    queryKey: ['unsplash-image', placeName, urlType],
    queryFn: async () => {
      const result = await fetchUnsplashImageUseCase.execute(placeName, { urlType });
      if (!result.success) throw result.error;
      return result.data ?? fallback;
    },
    enabled: !!placeName,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data: isError ? fallback : data, isLoading };
};
