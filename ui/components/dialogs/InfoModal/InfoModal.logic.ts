import { useModalState } from '@/features/core/state';

export const useInfoModalLogic = () => {
  const { modalActions, modalSelectors } = useModalState();

  const closeModal = () => modalActions.hideInfoModal();

  const { primaryAction, headerTitle, description, primaryButtonTitle } = modalSelectors.infoModal().modal;

  const primaryActionHandler = () => {
    if (primaryAction) {
      primaryAction();
      closeModal();
    } else {
      closeModal();
    }
  };

  return {
    isVisible: modalSelectors.infoModal().isVisible,
    primaryAction: primaryActionHandler,
    headerTitle,
    description: description ?? '',
    primaryButtonTitle,
  };
};
