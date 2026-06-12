import type { Id } from '@/convex/_generated/dataModel';
import { fetchPhotoNamesUseCase } from '@/features/core/images';
import { checkConnectivityUseCase } from '@/features/core/network';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';
import { useCallback, useRef } from 'react';

const MAX_PHOTOS = 6;

export const useRetryActivityImage = (
  tripId: Id<'trips'>,
  placeNumberID: number,
  placeName: string,
  location: string,
) => {
  const repo = useTripRepository();
  // Tracks URLs already retried this mount, so a broken image is re-fetched at most once.
  const retriedUrls = useRef<Set<string>>(new Set());

  const retryActivityImage = useCallback(
    async (failedUrl: string) => {
      if (retriedUrls.current.has(failedUrl)) return;
      const connectivity = await checkConnectivityUseCase.execute();
      if (!(connectivity.success && connectivity.data)) return;
      retriedUrls.current.add(failedUrl);

      const result = await fetchPhotoNamesUseCase.execute(`${placeName}, ${location}`, MAX_PHOTOS);
      if (!result.success) return;

      await repo.updateActivityPhotos({ id: tripId, placeNumberID, photoResourceNames: result.data });
    },
    [tripId, placeNumberID, placeName, location, repo],
  );

  return { retryActivityImage };
};
