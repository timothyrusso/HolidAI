import { useQuery } from '@tanstack/react-query';

import { fetchUnsplashImageUseCase } from '@/features/core/images/di/resolve';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import type { UrlType } from '@/features/core/images/domain/entities/UrlType';

const noImage = require('@/ui/assets/images/no-image-placeholder.jpg');

export const useGetUnsplashImage = (placeName: string, urlType: UrlType) => {
  const { data, isLoading } = useQuery<ImageResult>({
    queryKey: ['unsplash-image', placeName, urlType],
    queryFn: async () => {
      const result = await fetchUnsplashImageUseCase.execute(placeName, { urlType });
      return result.success ? result.data : { url: noImage };
    },
    enabled: !!placeName,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data, isLoading };
};
