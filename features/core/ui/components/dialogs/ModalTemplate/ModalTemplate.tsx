import type { ReactElement } from 'react';
import type { ModalProps } from 'react-native-modal';
import Modal from 'react-native-modal';

import { styles } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplate.style';
import { ModalBody } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateBody';
import { ModalContainer } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateContainer/ModalTemplateContainer';
import { ModalContent } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateContent';
import { ModalFixedFooter } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateFixedFooter';
import { ModalFooter } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateFooter';
import { ModalHeader } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateHeader/ModalTemplateHeader';
import { opacity } from '@/features/core/ui/style/opacity';

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
