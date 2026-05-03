import { useResetPassword } from '@/features/auth';
import { useModalState } from '@/features/core/state';
import { useToast } from '@/features/core/toast';
import { useState } from 'react';

const emailRegex = /\S+@\S+\.\S+/;

export const useResetPasswordModalLogic = () => {
  const { modalActions, modalSelectors } = useModalState();

  const { sendCode, resetPassword, isLoading } = useResetPassword();

  const [successfulCreation, setSuccessfulCreation] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const { showInfoToast } = useToast();

  const closeModal = () => modalActions.hideResetPasswordModal();

  const handleResetModal = () => {
    setCode('');
    setPassword('');
    setEmail('');
    setSuccessfulCreation(false);
    closeModal();
  };

  const handleCreateResetPasswordButton = async () => {
    if (!emailRegex.test(email)) {
      showInfoToast('GLOBAL.ERROR.INVALID_EMAIL');
      return;
    }
    const success = await sendCode(email);
    if (success) setSuccessfulCreation(true);
  };

  const handleChangePasswordButton = async () => {
    const success = await resetPassword(code, password);
    if (success) handleResetModal();
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
