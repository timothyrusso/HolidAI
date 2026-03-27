import { useToast } from '@/features/core/toast';
import { useProfileRepository } from '@/features/profile/data/repositories/useProfileRepository';
import { ProfileError } from '@/features/profile/domain/entities/errors/ProfileError';
import { useState } from 'react';

export const useDeleteAccount = () => {
  const repo = useProfileRepository();
  const { showErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteAccount = async (): Promise<boolean> => {
    setIsLoading(true);
    const userId = repo.getUser()?.id;
    if (!userId) {
      setIsLoading(false);
      showErrorToast(new ProfileError('User not loaded'));
      return false;
    }
    const tripsResult = await repo.deleteAllTrips(userId);
    if (!tripsResult.success) {
      setIsLoading(false);
      showErrorToast(tripsResult.error);
      return false;
    }
    const userResult = await repo.deleteUser();
    setIsLoading(false);
    if (!userResult.success) {
      showErrorToast(userResult.error);
      return false;
    }
    return true;
  };

  return { deleteAccount, isLoading };
};
