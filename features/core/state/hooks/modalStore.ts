import { create } from '@/features/core/state/libraries/createStore';
import { immer } from 'zustand/middleware/immer';

export type ModalType = {
  isVisible: boolean;
};

export type ResetPasswordModalContentType = {
  headerTitle?: string;
  primaryAction?: () => void;
  secondaryAction?: () => void;
  primaryButtonTitle?: string;
  secondaryButtonTitle?: string;
};

export type InfoModalContentType = {
  headerTitle?: string;
  primaryAction?: () => void;
  primaryButtonTitle?: string;
  description?: string;
};

export type ActionModalContentType = {
  headerTitle?: string;
  primaryAction: () => void;
  secondaryAction?: () => void;
  primaryButtonTitle?: string;
  secondaryButtonTitle?: string;
  description?: string;
};

export type ResetPasswordModalType = ModalType & {
  modal: ResetPasswordModalContentType;
};

export type InfoModalType = ModalType & {
  modal: InfoModalContentType;
};

export type ActionModalType = ModalType & {
  modal: ActionModalContentType;
};

export type ModalState = {
  resetPasswordModal: ResetPasswordModalType;
  infoModal: InfoModalType;
  actionModal: ActionModalType;
};

export type ModalActions = {
  actions: {
    showResetPasswordModal: (modal: ResetPasswordModalContentType) => void;
    hideResetPasswordModal: () => void;
    showInfoModal: (modal: InfoModalContentType) => void;
    hideInfoModal: () => void;
    showActionModal: (modal: ActionModalContentType) => void;
    hideActionModal: () => void;
    resetModal: () => void;
  };
};

const initialState: ModalState = {
  resetPasswordModal: {
    isVisible: false,
    modal: {
      headerTitle: undefined,
      primaryAction: () => {},
      secondaryAction: () => {},
      primaryButtonTitle: 'GLOBAL.BUTTON.CONFIRM',
      secondaryButtonTitle: 'GLOBAL.BUTTON.CANCEL',
    },
  },
  infoModal: {
    isVisible: false,
    modal: {},
  },
  actionModal: {
    isVisible: false,
    modal: {
      headerTitle: undefined,
      primaryAction: () => {},
      secondaryAction: () => {},
      primaryButtonTitle: 'GLOBAL.BUTTON.CONFIRM',
      secondaryButtonTitle: 'GLOBAL.BUTTON.CANCEL',
    },
  },
};

export const useModalStore = create<ModalState & ModalActions>()(
  immer(set => ({
    ...initialState,
    actions: {
      showResetPasswordModal: modal =>
        set({
          resetPasswordModal: {
            isVisible: true,
            modal,
          },
        }),
      hideResetPasswordModal: () =>
        set(state => ({
          resetPasswordModal: {
            isVisible: false,
            modal: state.resetPasswordModal.modal,
          },
        })),
      showInfoModal: modal =>
        set({
          infoModal: {
            isVisible: true,
            modal,
          },
        }),
      hideInfoModal: () =>
        set(state => ({
          infoModal: {
            isVisible: false,
            modal: state.infoModal.modal,
          },
        })),
      showActionModal: modal =>
        set({
          actionModal: {
            isVisible: true,
            modal,
          },
        }),
      hideActionModal: () =>
        set(state => ({
          actionModal: {
            isVisible: false,
            modal: state.actionModal.modal,
          },
        })),
      resetModal: () => set(initialState),
    },
  })),
);
