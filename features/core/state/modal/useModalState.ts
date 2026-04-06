import { createSelectors } from '@/features/core/state/libraries/createSelectors';
import { useModalStore } from '@/features/core/state/modal/modalStore';

export const useModalState = () => {
  const modalState = createSelectors(useModalStore);

  const { actions, ...stateSelectors } = modalState.use;

  return {
    modalActions: actions(),
    modalSelectors: { ...stateSelectors },
  };
};
