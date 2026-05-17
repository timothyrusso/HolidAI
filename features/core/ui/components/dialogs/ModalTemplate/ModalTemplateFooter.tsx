import type { FC, PropsWithChildren } from 'react';
import { View } from 'react-native';

import { styles } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplate.style';

export const ModalFooter: FC<PropsWithChildren> = ({ children }) => <View style={styles.footer}>{children}</View>;
