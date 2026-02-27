import type { ReactElement } from 'react';
import type { ModalProps } from 'react-native-modal';
import Modal from 'react-native-modal';

import { opacity } from '@/ui/style/opacity';
import { styles } from './ModalTemplate.style';
import ModalBody from './ModalTemplateBody';
import ModalContainer from './ModalTemplateContainer/ModalTemplateContainer';
import ModalContent from './ModalTemplateContent';
import ModalFixedFooter from './ModalTemplateFixedFooter';
import ModalFooter from './ModalTemplateFooter';
import ModalHeader from './ModalTemplateHeader/ModalTemplateHeader';

type ModalTemplateProps = Partial<ModalProps> & {
  isVisible: boolean;
  children: ReactElement;
};

const ModalTemplate = ({ isVisible = false, children, ...props }: ModalTemplateProps) => {
  return (
    <Modal
      useNativeDriverForBackdrop
      backdropOpacity={opacity.default}
      isVisible={isVisible}
      style={styles.modalView}
      {...props}
    >
      {children}
    </Modal>
  );
};

ModalTemplate.Container = ModalContainer;
ModalTemplate.Header = ModalHeader;
ModalTemplate.Content = ModalContent;
ModalTemplate.Body = ModalBody;
ModalTemplate.Footer = ModalFooter;
ModalTemplate.FixedFooter = ModalFixedFooter;

export default ModalTemplate;
