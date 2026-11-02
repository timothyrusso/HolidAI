import { useToast } from '@/features/core/toast';
import { TokensExhausted, useGetUserTokens } from '@/features/user';

export const useStartNewTrip = () => {
  const { userTokens } = useGetUserTokens();
  const { showErrorToast } = useToast();

  const canStart = () => {
    if (userTokens === 0) {
      showErrorToast(new TokensExhausted());
      return false;
    }
    return true;
  };

  return { canStart };
};
