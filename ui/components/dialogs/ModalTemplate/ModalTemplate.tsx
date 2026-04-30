import type { ReactElement } from 'react';
import type { ModalProps } from 'react-native-modal';
import Modal from 'react-native-modal';

import { styles } from '@/ui/components/dialogs/ModalTemplate/ModalTemplate.style';
import { ModalBody } from '@/ui/components/dialogs/ModalTemplate/ModalTemplateBody';
import { ModalContainer } from '@/ui/components/dialogs/ModalTemplate/ModalTemplateContainer/ModalTemplateContainer';
import { ModalContent } from '@/ui/components/dialogs/ModalTemplate/ModalTemplateContent';
import { ModalFixedFooter } from '@/ui/components/dialogs/ModalTemplate/ModalTemplateFixedFooter';
import { ModalFooter } from '@/ui/components/dialogs/ModalTemplate/ModalTemplateFooter';
import { ModalHeader } from '@/ui/components/dialogs/ModalTemplate/ModalTemplateHeader/ModalTemplateHeader';
import { opacity } from '@/ui/style/opacity';

type ModalTemplateProps = Partial<ModalProps> & {
  isVisible: boolean;
  children: ReactElement;
};

export const ModalTemplate = ({ isVisible = false, children, ...props }: ModalTemplateProps) => {
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
