import { useQuery } from '@tanstack/react-query';

import { fetchGooglePlaceImageUseCase } from '@/features/core/images/di/resolve';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';

const fallback: ImageResult = { url: require('@/ui/assets/images/no-image-placeholder.jpg') };

export const useGetGooglePlaceImage = (placeName: string, maxWidthPx = 500) => {
  const { data, isLoading, isError } = useQuery<ImageResult>({
    queryKey: ['google-place-image', placeName, maxWidthPx],
    queryFn: async () => {
      const result = await fetchGooglePlaceImageUseCase.execute(placeName, { maxWidthPx });
      if (!result.success) throw result.error;
      return result.data ?? fallback;
    },
    enabled: !!placeName,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data: isError ? fallback : data, isLoading };
};
