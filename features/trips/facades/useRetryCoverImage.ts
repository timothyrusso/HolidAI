import type { Id } from '@/convex/_generated/dataModel';
import { UrlType, fetchUnsplashImageUseCase } from '@/features/core/images';
import { checkConnectivityUseCase } from '@/features/core/network';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';
import { useCallback, useRef } from 'react';

export const useRetryCoverImage = (tripId: Id<'trips'> | undefined, location: string) => {
  const repo = useTripRepository();
  // Tracks URLs already retried this mount, so a broken image is re-fetched at most once.
  const retriedUrls = useRef<Set<string>>(new Set());

  const retryCoverImage = useCallback(
    async (failedUrl: string) => {
      if (!tripId) return;
      const connectivity = await checkConnectivityUseCase.execute();
      if (!(connectivity.success && connectivity.data)) return;
      if (retriedUrls.current.has(failedUrl)) return;
      retriedUrls.current.add(failedUrl);

      const result = await fetchUnsplashImageUseCase.execute(location, { urlType: UrlType.REGULAR });
      if (!(result.success && result.data)) return;

      const coverImage = {
        url: typeof result.data.url === 'string' ? result.data.url : '',
        blurHash: result.data.blurHash ?? '',
      };
      await repo.updateCoverImage({ id: tripId, coverImage });
    },
    [tripId, location, repo],
  );

  return { retryCoverImage };
};
