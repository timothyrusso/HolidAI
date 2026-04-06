import { modalStoreSelectors } from '@/features/core/state/modal/modalStore';

export const useModalState = () => {
  const { actions, ...modalSelectors } = modalStoreSelectors.use;

  return {
    modalActions: actions(),
    modalSelectors,
  };
};
