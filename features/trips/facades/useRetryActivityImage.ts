import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { useCallback } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';
import { useRetriedUrls } from '@/features/trips/hooks/useRetriedUrls';
import { retryActivityPhotos } from '@/features/trips/useCases/retryImage';

/** Looks up new photos when an activity's photo fails to load, once per failed URL and only online. */
export const useRetryActivityImage = (
  tripId: Id<'trips'> | undefined,
  placeNumberID: number,
  placeName: string,
  location: string,
) => {
  const { updateActivityPhotos } = useTripRepository();
  const isFirstRetry = useRetriedUrls();
  const { mutate } = useEffectMutation({
    mutationFn: ({ id, failedUrl }: { id: Id<'trips'>; failedUrl: string }) =>
      retryActivityPhotos(
        placeName,
        location,
        () => isFirstRetry(failedUrl),
        photoResourceNames => updateActivityPhotos({ id, placeNumberID, photoResourceNames }),
      ),
  });

  const retryActivityImage = useCallback(
    (failedUrl: string) => {
      if (tripId) mutate({ id: tripId, failedUrl });
    },
    [tripId, mutate],
  );

  return { retryActivityImage };
};
