import type { Id } from '@/convex/_generated/dataModel';
import { useToast } from '@/features/core/toast';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useDeleteTrip = () => {
  const { deleteTrip: deleteTripMutation } = useTripRepository();
  const { showErrorToast } = useToast();

  const deleteTrip = async (id: Id<'trips'>): Promise<boolean> => {
    const result = await deleteTripMutation(id);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  return { deleteTrip };
};
