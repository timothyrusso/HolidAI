import { useAuthRepository } from '@/features/auth/data/repositories/useAuthRepository';
import { useToast } from '@/features/core/toast';
import { useState } from 'react';

export const useSignIn = () => {
  const repo = useAuthRepository();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showErrorToast } = useToast();

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const result = await repo.signIn(email, password);
    setIsLoading(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  return { signIn, isLoading };
};
