import type { FC, PropsWithChildren } from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';

import { styles } from '@/ui/components/dialogs/ModalTemplate/ModalTemplate.style';

export const ModalBody: FC<PropsWithChildren<ViewProps>> = ({ children, ...props }) => (
  <View style={styles.body} {...props}>
    {children}
  </View>
);
