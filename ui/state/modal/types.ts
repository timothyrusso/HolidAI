export type ModalType = {
  isVisible: boolean;
};

export type ModalState = {
  resetPasswordModal: ResetPasswordModalType;
  infoModal: InfoModalType;
  actionModal: ActionModalType;
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
