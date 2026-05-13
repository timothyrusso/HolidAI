import { BaseError, ErrorCode } from '@/features/core/error';
import { useToast } from '@/features/core/toast';
import { useGetUserTokens } from '@/features/user';

export const useStartNewTrip = () => {
  const { userTokens } = useGetUserTokens();
  const { showErrorToast } = useToast();

  const canStart = () => {
    if (userTokens === 0) {
      showErrorToast(new BaseError('No tokens remaining', ErrorCode.TokensExhausted));
      return false;
    }
    return true;
  };

  return { canStart };
};
