import { resetAllStores } from '@/features/core/state';
import { useToast } from '@/features/core/toast';
import { useUserRepository } from '@/features/user/data/repositories/useUserRepository';
import { useState } from 'react';

export const useLogout = () => {
  const repo = useUserRepository();
  const { showErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    const result = await repo.signOut();
    setIsLoading(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    resetAllStores();
    return true;
  };

  return { logout, isLoading };
};
