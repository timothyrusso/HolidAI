import { logger } from '@/di/resolve';
import { ToastType, useToast } from '@/ui/hooks/useToast';
import { useModalState } from '@/ui/state/modal/useModalState';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';

export const useResetPasswordModalLogic = () => {
  const { modalActions, modalSelectors } = useModalState();
  const { showToast } = useToast();

  const closeModal = () => modalActions.hideResetPasswordModal();

  const [email, setEmail] = useState<string>('');

  const emailRegex = /\S+@\S+\.\S+/;

  const handleResetPasswordButton = async () => {
    if (!emailRegex.test(email)) {
      showToast('GLOBAL.ERROR.INVALID_EMAIL');
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email);
      showToast('SIGNIN.RESET_PASSWORD_SENT', ToastType.SUCCESS);
      closeModal();
    } catch (error) {
      logger.error(error as Error);
    }
  };

  return {
    closeModal,
    isVisible: modalSelectors.resetPasswordModal().isVisible,
    email,
    setEmail,
    handleResetPasswordButton,
  };
};
