import { BaseError, ErrorCode } from '@/features/core/error';
import { navigationService } from '@/features/core/navigation';
import { useToast } from '@/features/core/toast';
import { useGetUserTokens } from '@/features/user';

export const useStartNewTripCardLogic = () => {
  const { userTokens } = useGetUserTokens();
  const { showErrorToast } = useToast();

  const handleStartNewTrip = () => {
    if (userTokens === 0) {
      showErrorToast(new BaseError('No tokens remaining', ErrorCode.TokensExhausted));
      return;
    }
    navigationService.toSearch();
  };

  return { handleStartNewTrip };
};
