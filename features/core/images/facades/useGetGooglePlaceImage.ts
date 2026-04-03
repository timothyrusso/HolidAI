import { useQuery } from '@tanstack/react-query';

import { fetchGooglePlaceImageUseCase } from '@/features/core/images/di/resolve';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';

const noImage = require('@/ui/assets/images/no-image-placeholder.jpg');

export const useGetGooglePlaceImage = (placeName: string, maxWidthPx = 500) => {
  const { data, isLoading } = useQuery<ImageResult>({
    queryKey: ['google-place-image', placeName, maxWidthPx],
    queryFn: async () => {
      const result = await fetchGooglePlaceImageUseCase.execute(placeName, { maxWidthPx });
      return result.success ? result.data : { url: noImage };
    },
    enabled: !!placeName,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data, isLoading };
};
