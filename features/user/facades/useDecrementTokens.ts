import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { useUserRepository } from '@/features/user/data/repositories/useUserRepository';

/** Spends the signed-in user's generation tokens; a failure is logged and nothing else. */
export const useDecrementTokens = () => {
  const { decrementTokens } = useUserRepository();
  const { mutate } = useEffectMutation({ mutationFn: decrementTokens });

  return { decrementTokens: mutate };
};
