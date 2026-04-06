import { modalStoreSelectors } from '@/features/core/state/modal/modalStore';

export const useModalState = () => {
  const { actions, ...stateSelectors } = modalStoreSelectors.use;

  return {
    modalActions: actions(),
    modalSelectors: { ...stateSelectors },
  };
};
