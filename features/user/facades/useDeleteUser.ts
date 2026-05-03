import { useToast } from '@/features/core/toast';
import { useUserRepository } from '@/features/user/data/repositories/useUserRepository';
import { useState } from 'react';

export const useDeleteUser = () => {
  const repo = useUserRepository();
  const { showErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteUser = async (): Promise<boolean> => {
    setIsLoading(true);
    const result = await repo.deleteUser();
    setIsLoading(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  return { deleteUser, isLoading };
};
