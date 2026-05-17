import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { useActionModalLogic } from '@/features/core/ui/components/dialogs/ActionModal/ActionModal.logic';
import { ModalTemplate } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplate';
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
