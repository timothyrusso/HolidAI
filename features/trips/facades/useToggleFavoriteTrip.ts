import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

/** Marks a trip as a favourite or not; the list updates at once, before Convex confirms. */
export const useToggleFavoriteTrip = () => {
  const repo = useTripRepository();
  const { mutate } = useEffectMutation({ mutationFn: repo.toggleFavoriteTrip });

  return { toggleFavoriteTrip: mutate };
};
