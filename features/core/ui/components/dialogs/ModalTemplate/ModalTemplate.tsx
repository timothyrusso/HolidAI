import { styles } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplate.style';
import { ModalBody } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateBody';
import { ModalContent } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateContent';
import { ModalFixedFooter } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateFixedFooter';
import { ModalFooter } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateFooter';
import { ModalHeader } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateHeader/ModalTemplateHeader';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

export const ModalTemplate = ({ children }: PropsWithChildren) => <View style={styles.main}>{children}</View>;

ModalTemplate.Header = ModalHeader;
ModalTemplate.Content = ModalContent;
ModalTemplate.Body = ModalBody;
ModalTemplate.Footer = ModalFooter;
ModalTemplate.FixedFooter = ModalFixedFooter;
