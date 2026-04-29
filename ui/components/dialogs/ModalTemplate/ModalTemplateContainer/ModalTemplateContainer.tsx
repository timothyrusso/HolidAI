import type { FC, PropsWithChildren } from 'react';
import type { ViewProps } from 'react-native';
import { Animated } from 'react-native';

import { useModalTemplateContainerLogic } from './ModalTemplateContainer.logic';
import { styles } from './ModalTemplateContainer.style';

type ModalContainerProps = PropsWithChildren<ViewProps> & {
  maxHeight?: number;
};

export const ModalContainer: FC<ModalContainerProps> = ({ children, maxHeight, ...props }) => {
  const { containerStyle } = useModalTemplateContainerLogic(maxHeight);

  return (
    <Animated.View style={[styles.container, containerStyle]} {...props}>
      {children}
    </Animated.View>
  );
};
