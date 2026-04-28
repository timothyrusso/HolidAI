import { useToast } from '@/features/core/toast';
import { ProfileError } from '@/features/profile/domain/entities/errors/ProfileError';
import { useDeleteAllTrips } from '@/features/trips';
import { useDeleteUser, useGetUser } from '@/features/user';
import { useState } from 'react';

export const useDeleteAccount = () => {
  const { user } = useGetUser();
  const { deleteUser } = useDeleteUser();
  const { deleteAll } = useDeleteAllTrips();
  const { showErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteAccount = async (): Promise<boolean> => {
    setIsLoading(true);
    if (!user?.id) {
      setIsLoading(false);
      showErrorToast(new ProfileError('User not loaded'));
      return false;
    }
    const tripsDeleted = await deleteAll();
    if (!tripsDeleted) {
      setIsLoading(false);
      return false;
    }
    const deleted = await deleteUser();
    setIsLoading(false);
    return deleted;
  };

  return { deleteAccount, isLoading };
};
