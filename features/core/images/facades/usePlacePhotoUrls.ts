import { useEffectQuery } from '@timothyrusso/effect-core/react';
import { placePhotoUrls } from '@/features/core/images/useCases/placePhotoUrls';

const NO_URLS: readonly string[] = [];

/**
 * The media URL of each Google Places photo in `resourceNames`, `maxWidthPx` wide: empty while
 * they load, and when the Places key is missing, so the image shows its placeholder.
 */
export const usePlacePhotoUrls = (resourceNames: readonly string[], maxWidthPx: number): readonly string[] => {
  const { data } = useEffectQuery({
    queryKey: ['placePhotoUrls', resourceNames, maxWidthPx],
    queryFn: placePhotoUrls(resourceNames, maxWidthPx),
    enabled: resourceNames.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
  });
  return data ?? NO_URLS;
};
