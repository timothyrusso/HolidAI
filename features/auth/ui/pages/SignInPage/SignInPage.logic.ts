import { useSignIn } from '@/features/auth/facades/useSignIn';
import { navigationService } from '@/features/core/navigation';
import { useModalState } from '@/features/core/state';
import { useState } from 'react';

export const useSignInPageLogic = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { modalActions } = useModalState();

  const { signIn, isLoading } = useSignIn();

  const handleResetPasswordModal = () => {
    modalActions.showResetPasswordModal({ headerTitle: 'SIGNIN.RESET_PASSWORD_TITLE' });
  };

  const onSignInPress = async () => {
    const success = await signIn(email, password);
    if (success) navigationService.toAppRoot();
  };

  const handleSignUpPress = () => navigationService.toSignUp();

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleResetPasswordModal,
    onSignInPress,
    handleSignUpPress,
  };
};
