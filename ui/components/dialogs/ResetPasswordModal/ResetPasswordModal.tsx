import { components } from '@/ui/style/dimensions/components';
import ModalTemplate from '../ModalTemplate/ModalTemplate';
import { useResetPasswordModalLogic } from './ResetPasswordModal.logic';
import { ResetPasswordModalBody } from './components/ResetPasswordModalBody/ResetPasswordModalBody';

export const ResetPasswordModal = () => {
  const {
    isVisible,
    handleCreateResetPasswordButton,
    handleChangePasswordButton,
    code,
    setCode,
    password,
    setPassword,
    successfulCreation,
    email,
    setEmail,
    isLoading,
    handleResetModal,
  } = useResetPasswordModalLogic();

  return (
    <ModalTemplate isVisible={isVisible}>
      <ModalTemplate.Container
        maxHeight={
          successfulCreation ? components.createResetPasswordModalHeight : components.changeResetPasswordModalHeight
        }
      >
        <ModalTemplate.Header title={'SIGNIN.RESET_PASSWORD_TITLE'} action={handleResetModal} preventClosing />
        <ModalTemplate.Content>
          <ModalTemplate.Body>
            <ResetPasswordModalBody
              email={email}
              setEmail={setEmail}
              code={code}
              setCode={setCode}
              password={password}
              setPassword={setPassword}
              successfulCreation={successfulCreation}
            />
          </ModalTemplate.Body>
          <ModalTemplate.FixedFooter
            primaryButtonTitle={'GLOBAL.BUTTON.CONFIRM'}
            primaryAction={!successfulCreation ? handleCreateResetPasswordButton : handleChangePasswordButton}
            secondaryAction={handleResetModal}
            secondaryButtonTitle="GLOBAL.BUTTON.CANCEL"
            isPrimaryButtonLoading={isLoading}
          />
        </ModalTemplate.Content>
      </ModalTemplate.Container>
    </ModalTemplate>
  );
};
