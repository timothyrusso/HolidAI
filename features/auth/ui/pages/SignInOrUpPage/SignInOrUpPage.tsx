import { useSignInPageLogic } from '@/features/auth/ui/pages/SignInOrUpPage/SignInOrUpPage.logic';
import { AuthView } from '@clerk/expo/native';

export const SignInOrUpPage = () => {
  useSignInPageLogic();

  return <AuthView mode="signInOrUp" />;
};
