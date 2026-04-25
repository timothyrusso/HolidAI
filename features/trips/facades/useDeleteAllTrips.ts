import { useToast } from '@/features/core/toast';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';
import { useUser } from '@clerk/clerk-expo';

export const useDeleteAllTrips = () => {
  const { deleteAllTrips } = useTripRepository();
  const { user } = useUser();
  const { showErrorToast } = useToast();

  const deleteAll = async (): Promise<boolean> => {
    if (!user?.id) return false;
    const result = await deleteAllTrips(user.id);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  return { deleteAll };
};
