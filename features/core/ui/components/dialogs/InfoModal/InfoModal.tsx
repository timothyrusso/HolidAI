import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { useInfoModalLogic } from '@/features/core/ui/components/dialogs/InfoModal/InfoModal.logic';
import { ModalTemplate } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplate';
import { View } from 'react-native';

export const InfoModal = () => {
  const { isVisible, primaryAction, headerTitle, description, primaryButtonTitle } = useInfoModalLogic();

  return (
    <ModalTemplate isVisible={isVisible}>
      <ModalTemplate.Container>
        <ModalTemplate.Header title={headerTitle} action={primaryAction} />
        <ModalTemplate.Content>
          <ModalTemplate.Body>
            <View>
              <CustomText text={description} />
            </View>
          </ModalTemplate.Body>
          <ModalTemplate.FixedFooter primaryButtonTitle={primaryButtonTitle} primaryAction={primaryAction} />
        </ModalTemplate.Content>
      </ModalTemplate.Container>
    </ModalTemplate>
  );
};
