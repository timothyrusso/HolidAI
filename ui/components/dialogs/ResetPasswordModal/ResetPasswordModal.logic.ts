import { logger } from '@/di/resolve';
import { ToastType, useToast } from '@/ui/hooks/useToast';
import { useModalState } from '@/ui/state/modal/useModalState';
import { useClerk, useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';

export const useResetPasswordModalLogic = () => {
  const { modalActions, modalSelectors } = useModalState();
  const { showToast } = useToast();

  const { signOut } = useClerk();

  const closeModal = () => modalActions.hideResetPasswordModal();

  const [successfulCreation, setSuccessfulCreation] = useState(false);

  const [code, setCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailRegex = /\S+@\S+\.\S+/;

  const { isLoaded, signIn } = useSignIn();

  const handleCreateResetPasswordButton = async () => {
    if (!emailRegex.test(email)) {
      showToast('GLOBAL.ERROR.INVALID_EMAIL');
      return;
    }

    setIsLoading(true);

    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      setSuccessfulCreation(true);
    } catch (error) {
      logger.error(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetModal = () => {
    setCode('');
    setPassword('');
    setEmail('');
    setSuccessfulCreation(false);
    closeModal();
  };

  const handleChangePasswordButton = async () => {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const response = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (response.status === 'complete') {
        await signOut();
        showToast('SIGNIN.RESET_PASSWORD_SUCCESS', ToastType.SUCCESS);
        handleResetModal();
      }
    } catch (error) {
      logger.error(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isVisible: modalSelectors.resetPasswordModal().isVisible,
    email,
    setEmail,
    handleCreateResetPasswordButton,
    handleChangePasswordButton,
    code,
    setCode,
    password,
    setPassword,
    successfulCreation,
    isLoading,
    handleResetModal,
  };
};
