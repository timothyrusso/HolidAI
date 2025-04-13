import type { FC, PropsWithChildren } from 'react';
import { View } from 'react-native';

import { styles } from './ModalTemplate.style';

const ModalFooter: FC<PropsWithChildren> = ({ children }) => <View style={styles.footer}>{children}</View>;

export default ModalFooter;
