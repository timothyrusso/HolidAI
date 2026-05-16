import type { FC, PropsWithChildren } from 'react';
import type { ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native';

export const ModalContent: FC<PropsWithChildren<ScrollViewProps>> = ({ children, ...props }) => (
  <ScrollView {...props} keyboardShouldPersistTaps="handled">
    {children}
  </ScrollView>
);
