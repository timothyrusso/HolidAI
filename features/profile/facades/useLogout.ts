import { useToast } from '@/features/core/toast';
import { useProfileRepository } from '@/features/profile/data/repositories/useProfileRepository';
import { useState } from 'react';

export const useLogout = () => {
  const repo = useProfileRepository();
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
    return true;
  };

  return { logout, isLoading };
};
