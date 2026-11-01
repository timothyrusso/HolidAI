import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { useToast } from '@/features/core/toast';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { generateTrip } from '@/features/trip-generation/useCases/generateTrip';

/**
 * Generates a trip from the wizard's inputs and clears the wizard once it has one. A failure shows
 * an error toast and arrives as `error`. `generate` takes TanStack's per-call `onSuccess` and
 * `onError`, for the page to carry on or leave.
 */
export const useGenerateTrip = () => {
  const { tripActions } = useTripGenerationState();
  const { showErrorToast } = useToast();

  const { mutate, data, error } = useEffectMutation({
    mutationFn: generateTrip,
    onSuccess: () => tripActions.resetTripGenerationState(),
    onError: error => showErrorToast(error),
  });

  return { generate: mutate, trip: data, error };
};
