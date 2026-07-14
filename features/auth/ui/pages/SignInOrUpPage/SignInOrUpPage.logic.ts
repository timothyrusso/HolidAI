import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Routes } from '@/features/core/navigation';

export const useSignInPageLogic = () => {
  const { isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace(`/${Routes.HomePage}`);
    }
  }, [isSignedIn]);
};
