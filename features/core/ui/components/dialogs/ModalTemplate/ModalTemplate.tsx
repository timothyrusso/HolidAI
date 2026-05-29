import { styles } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplate.style';
import { ModalBody } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateBody';
import { ModalContent } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateContent';
import { ModalFixedFooter } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateFixedFooter';
import { ModalFooter } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateFooter';
import { ModalHeader } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateHeader/ModalTemplateHeader';
import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

type ModalTemplateProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export const ModalTemplate = ({ children, style }: ModalTemplateProps) => (
  <View style={[styles.main, style]}>{children}</View>
);

ModalTemplate.Header = ModalHeader;
ModalTemplate.Content = ModalContent;
ModalTemplate.Body = ModalBody;
ModalTemplate.Footer = ModalFooter;
ModalTemplate.FixedFooter = ModalFixedFooter;
