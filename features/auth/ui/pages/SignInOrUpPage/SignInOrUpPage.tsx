import { AuthView } from '@clerk/expo/native';
import { useSignInPageLogic } from '@/features/auth/ui/pages/SignInOrUpPage/SignInOrUpPage.logic';

export const SignInOrUpPage = () => {
  useSignInPageLogic();

  return <AuthView mode="signInOrUp" />;
};
