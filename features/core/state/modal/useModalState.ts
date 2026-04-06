import { modalStoreSelectors } from '@/features/core/state/modal/modalStore';

const { actions, ...modalSelectors } = modalStoreSelectors.use;

export const useModalState = () => ({
  modalActions: actions(),
  modalSelectors,
});
