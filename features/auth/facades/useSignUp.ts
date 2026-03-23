import { useAuthRepository } from '@/features/auth/data/repositories/useAuthRepository';
import { useToast } from '@/features/core/toast';
import { useState } from 'react';

export const useSignUp = () => {
  const repo = useAuthRepository();

  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);

  const { showErrorToast } = useToast();

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsSigningUp(true);
    const result = await repo.signUp(email, password, name);
    setIsSigningUp(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    setIsVerifyingEmail(true);
    const result = await repo.verifyEmail(code);
    setIsVerifyingEmail(false);
    if (!result.success) {
      showErrorToast(result.error);
      return false;
    }
    return true;
  };

  return { signUp, verifyEmail, isSigningUp, isVerifyingEmail };
};
