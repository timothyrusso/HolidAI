import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { useCallback } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';
import { useRetriedUrls } from '@/features/trips/hooks/useRetriedUrls';
import { retryDishImage as retry } from '@/features/trips/useCases/retryImage';

/** Looks up a new dish picture when one fails to load, once per failed URL and only online. */
export const useRetryDishImage = (tripId: Id<'trips'> | undefined, searchTerm: string) => {
  const { updateDishImage } = useTripRepository();
  const isFirstRetry = useRetriedUrls();
  const { mutate } = useEffectMutation({
    mutationFn: ({ id, failedUrl }: { id: Id<'trips'>; failedUrl: string }) =>
      retry(
        searchTerm,
        () => isFirstRetry(failedUrl),
        imageUrl => updateDishImage({ id, searchTerm, imageUrl }),
      ),
  });

  const retryDishImage = useCallback(
    (failedUrl: string) => {
      if (tripId) mutate({ id: tripId, failedUrl });
    },
    [tripId, mutate],
  );

  return { retryDishImage };
};
