import { useEffectQuery } from '@timothyrusso/effect-core/react';
import type { ImageRequest } from '@/features/core/images/domain/entities/ImageRequest';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import { fetchImage } from '@/features/core/images/useCases/fetchImage';

const NO_IMAGE: ImageResult = { url: require('@/features/core/design-system/assets/images/no-image-placeholder.jpg') };
const NO_DISH_IMAGE: ImageResult = { url: require('@/features/core/design-system/assets/images/food_placeholder.jpg') };

/** What a request shows when its provider has no image or fails. */
const placeholderFor = (request: ImageRequest): ImageResult =>
  request.source === 'wikimediaDish' ? NO_DISH_IMAGE : NO_IMAGE;

/**
 * The image for `request`, cached for the session. A provider with no image, or one that fails,
 * shows the placeholder: a missing picture never blocks the screen. `data` is `undefined` while
 * loading, and the query does not run for an empty `query`.
 */
export const useGetImage = (request: ImageRequest) => {
  const { data, isLoading, isError } = useEffectQuery({
    queryKey: ['image', request],
    queryFn: fetchImage(request),
    enabled: request.query.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return { data: isError || data === null ? placeholderFor(request) : data, isLoading };
};
