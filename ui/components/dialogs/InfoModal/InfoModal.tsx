import { View } from 'react-native';
import { CustomText } from '../../basic/CustomText/CustomText';
import { ModalTemplate } from '../ModalTemplate/ModalTemplate';
import { useInfoModalLogic } from './InfoModal.logic';

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
