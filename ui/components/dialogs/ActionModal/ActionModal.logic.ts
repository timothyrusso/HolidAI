import { useModalState } from '@/ui/state/modal/useModalState';

export const useActionModalLogic = () => {
  const { modalActions, modalSelectors } = useModalState();

  const closeModal = () => modalActions.hideActionModal();

  const { primaryAction, headerTitle, description, primaryButtonTitle, secondaryButtonTitle, secondaryAction } =
    modalSelectors.actionModal().modal;

  return {
    isVisible: modalSelectors.actionModal().isVisible,
    headerTitle,
    description: description ?? '',
    primaryAction,
    primaryButtonTitle,
    secondaryAction,
    secondaryButtonTitle,
    closeModal,
  };
};
