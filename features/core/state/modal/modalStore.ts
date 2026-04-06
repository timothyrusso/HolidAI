import { createSelectors } from '@/features/core/state/libraries/createSelectors';
import { registerStore } from '@/features/core/state/libraries/createStore';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

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

const createModalStore = () =>
  createWithEqualityFn<ModalState & ModalActions>()(
    set => ({
      ...initialState,
      actions: {
        showResetPasswordModal: modal => set({ resetPasswordModal: { isVisible: true, modal } }),
        hideResetPasswordModal: () =>
          set(state => ({ resetPasswordModal: { ...state.resetPasswordModal, isVisible: false } })),
        showInfoModal: modal => set({ infoModal: { isVisible: true, modal } }),
        hideInfoModal: () => set(state => ({ infoModal: { ...state.infoModal, isVisible: false } })),
        showActionModal: modal => set({ actionModal: { isVisible: true, modal } }),
        hideActionModal: () => set(state => ({ actionModal: { ...state.actionModal, isVisible: false } })),
        resetModal: () => set(initialState),
      },
    }),
    shallow,
  );

export const useModalStore = createModalStore();
export const modalStoreSelectors = createSelectors(useModalStore);
registerStore(useModalStore);
