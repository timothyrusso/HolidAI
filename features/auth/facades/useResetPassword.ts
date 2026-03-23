import { useAuthRepository } from '@/features/auth/data/repositories/useAuthRepository';
import { useToast } from '@/features/core/toast';
import { useState } from 'react';

export const useResetPassword = () => {
  const repo = useAuthRepository();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showErrorToast, showSuccessToast } = useToast();

  const sendCode = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    const result = await repo.sendPasswordResetCode(email);
    setIsLoading(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  const resetPassword = async (code: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    const result = await repo.resetPassword(code, newPassword);
    setIsLoading(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    showSuccessToast('SIGNIN.RESET_PASSWORD_SUCCESS');
    return true;
  };

  return { sendCode, resetPassword, isLoading };
};
