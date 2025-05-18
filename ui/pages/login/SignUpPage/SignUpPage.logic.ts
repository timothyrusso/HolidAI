import { logger } from '@/di/resolve';
import { Routes } from '@/ui/constants/routes';
import { useToast } from '@/ui/hooks/useToast';
import { useModalState } from '@/ui/state/modal/useModalState';
import auth, { sendEmailVerification, updateProfile } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import type { FirebaseError } from 'firebase/app';
import { useState } from 'react';

export const useSignUpPageLogic = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const { modalActions } = useModalState();

  const router = useRouter();

  const emailRegex = /\S+@\S+\.\S+/;

  const showInfoModal = () => {
    modalActions.showInfoModal({
      primaryAction: () => router.replace(`/${Routes.SignIn}`),
      description: 'SIGNUP.EMAIL_VERIFICATION_DESCRIPTION',
    });
  };

  const onCreateAccount = async () => {
    if (!(emailRegex.test(email) && password && password === confirmPassword && fullName)) {
      showToast('GLOBAL.ERROR.INVALID_CREDENTIALS');
      return;
    }

    setLoading(true);

    try {
      const result = await auth().createUserWithEmailAndPassword(email.toLowerCase(), password);
      updateProfile(result.user, {
        displayName: fullName,
      });
      sendEmailVerification(result.user);
      showInfoModal();
    } catch (error) {
      const { code: errorCode, message: errorMessage } = error as FirebaseError;
      showToast('GLOBAL.ERROR.INVALID_CREDENTIALS');
      logger.error(new Error(errorCode), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    onCreateAccount,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    isLoading: loading,
  };
};
