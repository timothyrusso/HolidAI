import { View } from 'react-native';
import { CustomText } from '../../basic/CustomText/CustomText';
import { ModalTemplate } from '../ModalTemplate/ModalTemplate';
import { useActionModalLogic } from './ActionModal.logic';

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
