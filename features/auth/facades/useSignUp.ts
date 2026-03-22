import { useAuthRepository } from '@/features/auth/data/repositories/useAuthRepository';
import { useToast } from '@/features/core/toast';
import { useState } from 'react';

export const useSignUp = () => {
  const repo = useAuthRepository();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showErrorToast } = useToast();

  const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
    setIsLoading(true);
    const result = await repo.signUp(email, password, fullName);
    setIsLoading(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    const result = await repo.verifyEmail(code);
    setIsLoading(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  return { signUp, verifyEmail, isLoading };
};
