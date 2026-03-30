import { useSignIn } from '@/features/auth/facades/useSignIn';
import { navigationService } from '@/features/core/navigation';
import { useModalState } from '@/ui/state/modal/useModalState';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useSignInPageLogic = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { modalActions } = useModalState();

  const router = useRouter();

  const { signIn, isLoading } = useSignIn();

  const handleResetPasswordModal = () => {
    modalActions.showResetPasswordModal({ headerTitle: 'SIGNIN.RESET_PASSWORD_TITLE' });
  };

  const onSignInPress = async () => {
    const success = await signIn(email, password);
    if (success) navigationService.toAppRoot();
  };

  return { email, setEmail, password, setPassword, isLoading, handleResetPasswordModal, onSignInPress, router };
};
