import { logger } from '@/di/resolve';
import { useModalState } from '@/ui/state/modal/useModalState';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useSignInPageLogic = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { modalActions } = useModalState();

  const handleResetPasswordModal = () => {
    modalActions.showResetPasswordModal({
      headerTitle: 'SIGNIN.RESET_PASSWORD_TITLE',
    });
  };

  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    setLoading(true);

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        // biome-ignore lint/suspicious/noConsole: <>
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      logger.error(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading: loading,
    handleResetPasswordModal,
    onSignInPress,
    router,
  };
};
