import { useEffectMutation } from '@timothyrusso/effect-core/react';
import type { GeneratedTrip } from '@/features/ai';
import { useToast } from '@/features/core/toast';
import { saveTrip } from '@/features/trip-generation/useCases/saveTrip';
import { useAddTrip } from '@/features/trips';
import { useGetUser } from '@/features/user';

/**
 * Saves a generated trip, with its pictures, for the signed-in user. A failure shows an error
 * toast and arrives as `error`. `save` takes TanStack's per-call `onSuccess` (with the new trip's
 * id) and `onError`, for the page to carry on or leave.
 */
export const useSaveTrip = () => {
  const { user } = useGetUser();
  const { addTrip } = useAddTrip();
  const { showErrorToast } = useToast();

  const { mutate, error } = useEffectMutation({
    mutationFn: (trip: GeneratedTrip) =>
      saveTrip(trip, tripAiResp => addTrip({ userId: user?.id ?? 'unknown_user', tripAiResp, isFavorite: false })),
    onError: error => showErrorToast(error),
  });

  return { save: mutate, error };
};
