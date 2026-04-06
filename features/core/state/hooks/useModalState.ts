import { useModalStore } from '@/features/core/state/hooks/modalStore';
import { createSelectors } from '@/features/core/state/libraries/createSelectors';

export const useModalState = () => {
  const modalState = createSelectors(useModalStore);

  const { actions, ...stateSelectors } = modalState.use;

  return {
    modalActions: actions(),
    modalSelectors: { ...stateSelectors },
  };
};
