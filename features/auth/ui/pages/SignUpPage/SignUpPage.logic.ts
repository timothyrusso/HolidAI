import { useSignUp } from '@/features/auth/facades/useSignUp';
import { useToast } from '@/features/core/toast';
import { Routes } from '@/modules/navigation/domain/entities/routes';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useSignUpPageLogic = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [pendingVerification, setPendingVerification] = useState<boolean>(false);

  const router = useRouter();

  const { signUp, verifyEmail, isLoading } = useSignUp();

  const { showInfoToast } = useToast();

  const onSignUpPress = async () => {
    if (password !== confirmPassword) {
      showInfoToast('SIGNUP.ERROR.PASSWORDS_DO_NOT_MATCH');
      return;
    }
    const success = await signUp(email, password, fullName);
    if (success) setPendingVerification(true);
  };

  const onVerifyPress = async () => {
    const success = await verifyEmail(code);
    if (success) router.replace(`/${Routes.HomePage}`);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    code,
    setCode,
    pendingVerification,
    isLoading,
    onSignUpPress,
    onVerifyPress,
  };
};
