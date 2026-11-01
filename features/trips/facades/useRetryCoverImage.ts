import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { useCallback } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';
import { useRetriedUrls } from '@/features/trips/hooks/useRetriedUrls';
import { retryCoverImage as retry } from '@/features/trips/useCases/retryImage';

/** Looks up a new cover when the trip's cover fails to load, once per failed URL and only online. */
export const useRetryCoverImage = (tripId: Id<'trips'> | undefined, location: string) => {
  const { updateCoverImage } = useTripRepository();
  const isFirstRetry = useRetriedUrls();
  const { mutate } = useEffectMutation({
    mutationFn: ({ id, failedUrl }: { id: Id<'trips'>; failedUrl: string }) =>
      retry(
        location,
        () => isFirstRetry(failedUrl),
        coverImage => updateCoverImage({ id, coverImage }),
      ),
  });

  const retryCoverImage = useCallback(
    (failedUrl: string) => {
      if (tripId) mutate({ id: tripId, failedUrl });
    },
    [tripId, mutate],
  );

  return { retryCoverImage };
};
