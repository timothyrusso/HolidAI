import { useCallback, useRef } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import { fetchWikimediaDishImageUseCase } from '@/features/core/images';
import { checkConnectivityUseCase } from '@/features/core/network';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useRetryDishImage = (tripId: Id<'trips'> | undefined, searchTerm: string) => {
  const repo = useTripRepository();
  // Tracks URLs already retried this mount, so a broken image is re-fetched at most once.
  const retriedUrls = useRef<Set<string>>(new Set());

  const retryDishImage = useCallback(
    async (failedUrl: string) => {
      if (!tripId) return;
      const connectivity = await checkConnectivityUseCase.execute();
      if (!(connectivity.success && connectivity.data)) return;
      if (retriedUrls.current.has(failedUrl)) return;
      retriedUrls.current.add(failedUrl);

      const result = await fetchWikimediaDishImageUseCase.execute(searchTerm);
      if (!result.success) return;

      const imageUrl = typeof result.data?.url === 'string' ? result.data.url : '';
      await repo.updateDishImage({ id: tripId, searchTerm, imageUrl });
    },
    [tripId, searchTerm, repo],
  );

  return { retryDishImage };
};
