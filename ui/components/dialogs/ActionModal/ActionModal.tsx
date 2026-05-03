import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import { useActionModalLogic } from '@/ui/components/dialogs/ActionModal/ActionModal.logic';
import { ModalTemplate } from '@/ui/components/dialogs/ModalTemplate/ModalTemplate';
import { View } from 'react-native';

export const ActionModal = () => {
  const {
    isVisible,
    headerTitle,
    description,
    primaryAction,
    primaryButtonTitle,
    secondaryAction,
    secondaryButtonTitle,
    closeModal,
  } = useActionModalLogic();

  return (
    <ModalTemplate isVisible={isVisible}>
      <ModalTemplate.Container>
        <ModalTemplate.Header title={headerTitle} action={closeModal} />
        <ModalTemplate.Content>
          <ModalTemplate.Body>
            <View>
              <CustomText text={description} />
            </View>
          </ModalTemplate.Body>
          <ModalTemplate.FixedFooter
            primaryButtonTitle={primaryButtonTitle}
            primaryAction={primaryAction}
            secondaryButtonTitle={secondaryButtonTitle}
            secondaryAction={secondaryAction}
          />
        </ModalTemplate.Content>
      </ModalTemplate.Container>
    </ModalTemplate>
  );
};
