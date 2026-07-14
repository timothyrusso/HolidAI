import { useCallback, useRef } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import { fetchPhotoNamesUseCase } from '@/features/core/images';
import { checkConnectivityUseCase } from '@/features/core/network';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

const MAX_PHOTOS = 6;

export const useRetryActivityImage = (
  tripId: Id<'trips'> | undefined,
  placeNumberID: number,
  placeName: string,
  location: string,
) => {
  const repo = useTripRepository();
  // Tracks URLs already retried this mount, so a broken image is re-fetched at most once.
  const retriedUrls = useRef<Set<string>>(new Set());

  const retryActivityImage = useCallback(
    async (failedUrl: string) => {
      if (!tripId) return;
      const connectivity = await checkConnectivityUseCase.execute();
      if (!(connectivity.success && connectivity.data)) return;
      if (retriedUrls.current.has(failedUrl)) return;
      retriedUrls.current.add(failedUrl);

      const result = await fetchPhotoNamesUseCase.execute(`${placeName}, ${location}`, MAX_PHOTOS);
      if (!result.success) return;

      await repo.updateActivityPhotos({ id: tripId, placeNumberID, photoResourceNames: result.data });
    },
    [tripId, placeNumberID, placeName, location, repo],
  );

  return { retryActivityImage };
};
