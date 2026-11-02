import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { useToast } from '@/features/core/toast';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

/**
 * Deletes a trip; a failure shows an error toast. `deleteTrip` takes TanStack's per-call
 * `onSuccess`, for the page to leave once the trip is gone.
 */
export const useDeleteTrip = () => {
  const repo = useTripRepository();
  const { showErrorToast } = useToast();
  const { mutate } = useEffectMutation({ mutationFn: repo.deleteTrip, onError: error => showErrorToast(error) });

  return { deleteTrip: mutate };
};
