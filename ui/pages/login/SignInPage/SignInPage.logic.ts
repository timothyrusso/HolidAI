import { logger } from '@/di/resolve';
import { Routes } from '@/ui/constants/navigation/routes';
import { ToastType, useToast } from '@/ui/hooks/useToast';
import { useModalState } from '@/ui/state/modal/useModalState';
import auth, { sendEmailVerification, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import type { AuthError } from 'firebase/auth';
import { useState } from 'react';

export const useSignInPageLogic = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const { modalActions } = useModalState();

  const handleUnconfirmedEmailModal = (authUser: FirebaseAuthTypes.User) => {
    modalActions.showActionModal({
      headerTitle: 'SIGNIN.UNCONFIRMED_EMAIL_TITLE',
      description: 'SIGNIN.UNCONFIRMED_EMAIL_DESCRIPTION',
      primaryAction: () => modalActions.hideActionModal(),
      secondaryAction: () => handleSendEmailVerification(authUser),
      secondaryButtonTitle: 'SIGNIN.SEND_EMAIL_VERIFICATION',
    });
  };

  const handleSendEmailVerification = (authUser: FirebaseAuthTypes.User) => {
    sendEmailVerification(authUser);
    modalActions.hideActionModal();
    showToast('SIGNIN.EMAIL_VERIFICATION_SENT', ToastType.SUCCESS);
  };

  const emailRegex = /\S+@\S+\.\S+/;

  const onSignIn = async () => {
    if (!(emailRegex.test(email) && password)) {
      showToast('GLOBAL.ERROR.INVALID_CREDENTIALS');
      return;
    }

    setLoading(true);

    try {
      const response = await auth().signInWithEmailAndPassword(email.toLowerCase(), password);
      if (!response.user.emailVerified) {
        handleUnconfirmedEmailModal(response.user);
        return;
      }
      router.replace(`/${Routes.MyTrips}`);
    } catch (error) {
      const typedError = error as AuthError;
      showToast('GLOBAL.ERROR.INVALID_CREDENTIALS');
      logger.error(typedError);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordButton = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      showToast('SIGNIN.RESET_PASSWORD_SENT', ToastType.SUCCESS);
    } catch (error) {
      logger.error(error as Error);
    }
  };

  const handleResetPasswordModal = () => {
    modalActions.showResetPasswordModal({
      headerTitle: 'SIGNIN.RESET_PASSWORD_TITLE',
      primaryAction: handleResetPasswordButton,
    });
  };

  return {
    onSignIn,
    email,
    setEmail,
    password,
    setPassword,
    isLoading: loading,
    handleResetPasswordButton,
    handleResetPasswordModal,
  };
};
