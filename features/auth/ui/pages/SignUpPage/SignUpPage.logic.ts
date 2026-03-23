import { useSignUp } from '@/features/auth/facades/useSignUp';
import { useToast } from '@/features/core/toast';
import { Routes } from '@/modules/navigation/domain/entities/routes';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useSignUpPageLogic = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [pendingVerification, setPendingVerification] = useState<boolean>(false);

  const router = useRouter();

  const { signUp, verifyEmail, isSigningUp, isVerifyingEmail } = useSignUp();

  const { showInfoToast } = useToast();

  const onSignUpPress = async () => {
    if (password !== confirmPassword) {
      showInfoToast('SIGNUP.ERROR.PASSWORDS_DO_NOT_MATCH');
      return;
    }
    const success = await signUp(email, password, name);
    if (success) setPendingVerification(true);
  };

  const onVerifyPress = async () => {
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      showInfoToast('SIGNUP.ERROR.VERIFICATION_CODE_REQUIRED');
      return;
    }
    const success = await verifyEmail(normalizedCode);
    if (success) router.replace(`/${Routes.HomePage}`);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    code,
    setCode,
    pendingVerification,
    isLoading: pendingVerification ? isVerifyingEmail : isSigningUp,
    onSignUpPress,
    onVerifyPress,
  };
};
